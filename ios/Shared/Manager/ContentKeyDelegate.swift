/*
 Copyright (C) 2017 Apple Inc. All Rights Reserved.
 See LICENSE.txt for this sample’s licensing information
 
 Abstract:
 `ContentKeyDelegate` is a class that implements the `AVContentKeySessionDelegate` protocol to respond to content key
 requests using FairPlay Streaming.
 */

import AVFoundation

class ContentKeyDelegate: NSObject, AVContentKeySessionDelegate {
    
    // MARK: Types
    var currentAsset: Asset? = nil
    enum ProgramError: Error {
        case missingApplicationCertificate
        case noCKCReturnedByKSM
    }
    
    // MARK: Properties
    
    /// The directory that is used to save persistable content keys.
    lazy var contentKeyDirectory: URL = {
        guard let documentPath =
            NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else {
                fatalError("Unable to determine library URL")
        }
        
        let documentURL = URL(fileURLWithPath: documentPath)
        
        let contentKeyDirectory = documentURL.appendingPathComponent(".keys", isDirectory: true)
        
        if !FileManager.default.fileExists(atPath: contentKeyDirectory.path, isDirectory: nil) {
            do {
                try FileManager.default.createDirectory(at: contentKeyDirectory,
                                                    withIntermediateDirectories: false,
                                                    attributes: nil)
            } catch {
                fatalError("Unable to create directory for content keys at path: \(contentKeyDirectory.path)")
            }
        }
        
        return contentKeyDirectory
    }()
    
    /// A set containing the currently pending content key identifiers associated with persistable content key requests that have not been completed.
    var pendingPersistableContentKeyIdentifiers = Set<String>()
    
    /// A dictionary mapping content key identifiers to their associated stream name.
    var contentKeyToStreamNameMap = [String: String]()
    
    func requestApplicationCertificate() throws -> Data {
        
//        // MARK: ADAPT - You must implement this method to retrieve your FPS application certificate.
//        let applicationCertificate: Data? = nil
//
//        guard applicationCertificate != nil else {
//            throw ProgramError.missingApplicationCertificate
//        }
//
//        return applicationCertificate!
        
        // MARK: ADAPT - You must implement this method to retrieve your FPS application certificate.
        var applicationCertificate: Data? = nil

        do {
            if let certUrl = Bundle.main.path(forResource: "fairplay", ofType: "cer") {
                applicationCertificate = try Data.init(contentsOf:  URL.init(fileURLWithPath: certUrl), options: .mappedIfSafe)
            }
            
//            applicationCertificate = AssetPersistenceManager.sharedManager.delegate?.contentCertificate()
        } catch {
            print("Cannot loading FairPlay application certificate. Detail are :\(error)")
        }
        
        guard applicationCertificate != nil else {
            throw ProgramError.missingApplicationCertificate
        }
        
        return applicationCertificate!
    }
    
    func requestContentKeyFromKeySecurityModule(spcData: Data, drmToken: String) throws -> Data {
        
        
        var ckcData: Data? = nil
        let drmUrl = "https://lic.drmtoday.com/license-server-fairplay/?offline=true"
        let semaphore = DispatchSemaphore(value: 0)
        
        var allowedCharacters = NSCharacterSet.urlQueryAllowed
        allowedCharacters.remove(charactersIn: "+/=\\")
        
        let encodedString = spcData.base64EncodedString().addingPercentEncoding(withAllowedCharacters: allowedCharacters)!
        
        var request = URLRequest(url: URL(string: drmUrl)!) 
            request.httpMethod = "POST"
            request.setValue(String(spcData.count), forHTTPHeaderField: "Content-Length")
            request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
            request.setValue(drmToken, forHTTPHeaderField: "x-dt-auth-token")
        
            request.httpBody = "spc=\(encodedString)".data(using: .utf8)
            
            
            URLSession.shared.dataTask(with: request) { (data, response, error) in
                if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 {
                    print("The access token was expired.")
                }else if let data = data, var responseString = String(data: data, encoding: .utf8) {
                    responseString = responseString.replacingOccurrences(of: "<ckc>", with: "").replacingOccurrences(of: "</ckc>", with: "")
                    print("the ckc content is \(responseString)")
                  ckcData = Data(base64Encoded: responseString)
                    
                } else {
                    print("Error encountered while fetching FairPlay license for URL: \(String(describing: drmUrl)), \(error?.localizedDescription ?? "Unknown error")")
                }
                semaphore.signal()
            }.resume()
    
        
        semaphore.wait()
        guard ckcData != nil else {
            throw ProgramError.noCKCReturnedByKSM
        }
        return ckcData!
    }

    /// Preloads all the content keys associated with an Asset for persisting on disk.
    ///
    /// It is recommended you use AVContentKeySession to initiate the key loading process
    /// for online keys too. Key loading time can be a significant portion of your playback
    /// startup time because applications normally load keys when they receive an on-demand
    /// key request. You can improve the playback startup experience for your users if you
    /// load keys even before the user has picked something to play. AVContentKeySession allows
    /// you to initiate a key loading process and then use the key request you get to load the
    /// keys independent of the playback session. This is called key preloading. After loading
    /// the keys you can request playback, so during playback you don't have to load any keys,
    /// and the playback decryption can start immediately.
    ///
    /// In this sample use the Streams.plist to specify your own content key identifiers to use
    /// for loading content keys for your media. See the README document for more information.
    ///
    /// - Parameter asset: The `Asset` to preload keys for.
    func requestPersistableContentKeys(forAsset asset: Asset) {
        self.currentAsset = asset
        for identifier in asset.stream.contentKeyIDList ?? [] {
            
            guard let contentKeyIdentifierURL = URL(string: identifier) else { continue }
            guard let assetIDString = contentKeyIdentifierURL.queryParameters?["assetId"] ?? contentKeyIdentifierURL.host else { continue }
            pendingPersistableContentKeyIdentifiers.insert(assetIDString)
            contentKeyToStreamNameMap[assetIDString] = asset.stream.name
            ContentKeyManager.shared.contentKeySession.processContentKeyRequest(withIdentifier: identifier, initializationData: nil, options: nil)
        }
    }
    
    /// Returns whether or not a content key should be persistable on disk.
    ///
    /// - Parameter identifier: The asset ID associated with the content key request.
    /// - Returns: `true` if the content key request should be persistable, `false` otherwise.
    func shouldRequestPersistableContentKey(withIdentifier identifier: String) -> Bool {
        return pendingPersistableContentKeyIdentifiers.contains(identifier)
    }
    
    // MARK: AVContentKeySessionDelegate Methods
    
    /*
     The following delegate callback gets called when the client initiates a key request or AVFoundation
     determines that the content is encrypted based on the playlist the client provided when it requests playback.
     */
    func contentKeySession(_ session: AVContentKeySession, didProvide keyRequest: AVContentKeyRequest) {
        handleStreamingContentKeyRequest(keyRequest: keyRequest)
    }
    
    /*
     Provides the receiver with a new content key request representing a renewal of an existing content key.
     Will be invoked by an AVContentKeySession as the result of a call to -renewExpiringResponseDataForContentKeyRequest:.
     */
    func contentKeySession(_ session: AVContentKeySession, didProvideRenewingContentKeyRequest keyRequest: AVContentKeyRequest) {
        handleStreamingContentKeyRequest(keyRequest: keyRequest)
    }
    
    /*
     Provides the receiver a content key request that should be retried because a previous content key request failed.
     Will be invoked by an AVContentKeySession when a content key request should be retried. The reason for failure of
     previous content key request is specified. The receiver can decide if it wants to request AVContentKeySession to
     retry this key request based on the reason. If the receiver returns YES, AVContentKeySession would restart the
     key request process. If the receiver returns NO or if it does not implement this delegate method, the content key
     request would fail and AVContentKeySession would let the receiver know through
     -contentKeySession:contentKeyRequest:didFailWithError:.
     */
    func contentKeySession(_ session: AVContentKeySession, shouldRetry keyRequest: AVContentKeyRequest,
                           reason retryReason: AVContentKeyRequestRetryReason) -> Bool {
        
        var shouldRetry = false
        
        switch retryReason {
            /*
             Indicates that the content key request should be retried because the key response was not set soon enough either
             due the initial request/response was taking too long, or a lease was expiring in the meantime.
             */
        case AVContentKeyRequestRetryReason.timedOut:
            shouldRetry = true
            
            /*
             Indicates that the content key request should be retried because a key response with expired lease was set on the
             previous content key request.
             */
        case AVContentKeyRequestRetryReason.receivedResponseWithExpiredLease:
            shouldRetry = true
            
            /*
             Indicates that the content key request should be retried because an obsolete key response was set on the previous
             content key request.
             */
        case AVContentKeyRequestRetryReason.receivedObsoleteContentKey:
            shouldRetry = true
            
        default:
            break
        }
        
        return shouldRetry
    }
    
    // Informs the receiver a content key request has failed.
    func contentKeySession(_ session: AVContentKeySession, contentKeyRequest keyRequest: AVContentKeyRequest, didFailWithError err: Error) {
        // Add your code here to handle errors.  
        var userInfo = [String: Any]()
        userInfo[Asset.Keys.identifier] = keyRequest.identifier 
        NotificationCenter.default.post(name: .AssetDownloadFail, object: nil, userInfo: userInfo)
    }

    
    // MARK: API
    
    func handleStreamingContentKeyRequest(keyRequest: AVContentKeyRequest) {
        guard let contentKeyIdentifierString = keyRequest.identifier as? String,
              let contentKeyIdentifierURL = URL(string: contentKeyIdentifierString),
              let assetIDString = contentKeyIdentifierURL.queryParameters?["assetId"] ?? contentKeyIdentifierURL.host        else {
            print("Failed to retrieve the assetID from the keyRequest!")
            return
        }
        
        guard let contentIdentifierData = contentKeyIdentifierString.data(using: .utf8) else {
            return
        }
        
        
        if shouldRequestPersistableContentKey(withIdentifier: assetIDString) ||
            persistableContentKeyExistsOnDisk(withContentKeyIdentifier: assetIDString) {
            
            // Request a Persistable Key Request.
            do {
                try keyRequest.respondByRequestingPersistableContentKeyRequestAndReturnError()
            } catch {
                
                /*
                 This case will occur when the client gets a key loading request from an AirPlay Session.
                 You should answer the key request using an online key from your key server.
                 */
                provideOnlineKey(withKeyRequest: keyRequest, contentIdentifier: contentIdentifierData)
            }
            
            return
        }
        provideOnlineKey(withKeyRequest: keyRequest, contentIdentifier: contentIdentifierData)

    }
    
    func provideOnlineKey(withKeyRequest keyRequest: AVContentKeyRequest, contentIdentifier contentIdentifierData: Data) {
        
        
        guard let contentKeyIdentifierString = keyRequest.identifier as? String, let contentKeyIdentifierURL = URL(string: contentKeyIdentifierString),
            let assetIDString = contentKeyIdentifierURL.queryParameters?["assetId"] ?? contentKeyIdentifierURL.host
            else {
                print("Failed to retrieve the assetID from the keyRequest!")
                return
        }
        
        /*
         Completion handler for makeStreamingContentKeyRequestData method.
         1. Sends obtained SPC to Key Server
         2. Receives CKC from Key Server
         3. Makes content key response object (AVContentKeyResponse)
         4. Provide the content key response object to make protected content available for processing
        */
        let getCkcAndMakeContentAvailable = { [weak self] (spcData: Data?, error: Error?) in
            guard let strongSelf = self else { return }
            
            if let error = error {
                /*
                 Obtaining a content key response has failed.
                 Report error to AVFoundation.
                */
                keyRequest.processContentKeyResponseError(error)
                return
            }

            guard let spcData = spcData else { return }

            do {
                
                /*
                 Send SPC to Key Server and obtain CKC.
                */
                
                // Hack to recieve drm token vikas
                guard let url = URL(string: "https://api.uat.msky.vn/evergent-gateway/getDRMToken?assetID=\(assetIDString)&type=vod&serviceID=hbo&duration=756456&storeLicense=true") else {
                    return
                }
                var urlRequest = URLRequest(url: url)
                urlRequest.setValue( "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJkZXZpY2VUeXBlIjoidW5rbm93biIsImxvYyI6IklOIiwiYXBpS2V5IjoiUDV0R3p1bXlGN3dqVDVjaGcyMTJHN2c3RkJ1S2V2MVEiLCJ2c3RhdHVzIjpmYWxzZSwibG9naW5UeXBlIjoiQ29udGFjdFVzZXJOYW1lIiwiaXNzIjoiZXYiLCJtb2RlbE5vIjoidW5rbm93biIsImNwIjoiTVNLWSIsImRldmljZU5hbWUiOiJ1bmtub3duIiwic2lkIjoiMjIwNTI3MDUxMzU3MjEyNjY0OTU0NjAiLCJzZXJpYWxObyI6InVua25vd24iLCJ1aWQiOiI4NTBjODUyYS0zZmQzLTQ0ODAtYjMxMC05ODY3N2MyNTVlN2UiLCJhdWQiOiJNU0tZIiwibmJmIjoxNjYwMjk3MTkyLCJleHAiOjE2NjI4ODkxOTcsImlhdCI6MTY2MDI5NzE5NywianRpIjoibXBJNC1nQzMzLVRLSHEtSEtUSS1nWVI5LUJieDUtOTYiLCJjaWQiOiI2NzIwNDE5OSJ9.aAmcwSC5fZYppQmECVKGXAtAEaYsA6F2P5kCOYyOMjo2A9EJri-Lt19PfBk_7LZ3KT4cdSDHMmt_aUQ5XZEtKaJNt2oi8uqfCD2gtsWj8bx8F7-nUvdZp8wb6EFgJqDDXC6AEXgrePEpinHJyjSQnxZruKOKNNSDRHyaMb-uKBJ55vSrGKOYf7Oxdyn0jimZCAqUbADEp9fxDU9ra2CZCFqhK045fqtp9pNbu7SIyWJyOJHIDfKgngWfopiiuNS5dh8zUenudFS1dXQTzA3Wj6YpNoIE4biEav6l2KDYfVZD4sduJ4QuHOhWm9Onmb7Ya3IFur0e4zad2eCQCzrvPg", forHTTPHeaderField: "Authorization")

                
                let (data, response, error) = URLSession.shared.synchronousDataTask(urlRequest: urlRequest)

                
                if error != nil || data == nil  {
                    print("error in gettting drm token please change bearer token than execute again \(self) ")
                }
 
                let decoder = JSONDecoder()
                let welcome =  try? decoder.decode(Welcome.self, from: data!)
                
            
                
                let ckcData = try strongSelf.requestContentKeyFromKeySecurityModule(spcData: spcData, drmToken: welcome!.data.drmtoken)

                
                /*
                 AVContentKeyResponse is used to represent the data returned from the key server when requesting a key for
                 decrypting content.
                 */
                
                let keyResponse = AVContentKeyResponse(fairPlayStreamingKeyResponseData: ckcData)

                
                /*
                 Provide the content key response to make protected content available for processing.
                */
                keyRequest.processContentKeyResponse(keyResponse)
            } catch {
                
                /*
                 Report error to AVFoundation.
                */
                keyRequest.processContentKeyResponseError(error)
            }
        }


        /*
         Pass Content Id unicode string together with FPS Certificate to obtain content key request data for a specific combination of application and content.
        */
        let applicationCertificate = try? self.requestApplicationCertificate()
        keyRequest.makeStreamingContentKeyRequestData(forApp: applicationCertificate!,
                                                      contentIdentifier: contentIdentifierData,
                                                      options: [AVContentKeyRequestProtocolVersionsKey: [1]],
                                                      completionHandler: getCkcAndMakeContentAvailable)
            
    }
}

extension URL {
    public var queryParameters: [String: String]? {
        guard
            let components = URLComponents(url: self, resolvingAgainstBaseURL: true),
            let queryItems = components.queryItems else { return nil }
        return queryItems.reduce(into: [String: String]()) { (result, item) in
            result[item.name] = item.value
        }
    }
}


extension URLSession {
    func synchronousDataTask(urlRequest: URLRequest) -> (data: Data?, response: URLResponse?, error: Error?) {
        var data: Data?
        var response: URLResponse?
        var error: Error?

        let semaphore = DispatchSemaphore(value: 0)

        let dataTask = self.dataTask(with: urlRequest) {
            data = $0
            response = $1
            error = $2

            semaphore.signal()
        }
        dataTask.resume()

        _ = semaphore.wait(timeout: .distantFuture)

        return (data, response, error)
    }
}
