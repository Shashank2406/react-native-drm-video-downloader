module.exports = {
    dependencies: {
        'react-native-video': {
            platforms: {
                android: {
                    sourceDir: '../node_modules/react-native-video/android-exoplayer',
                },
            },
        },
    },
    project: {
        ios: {},
        android: {},
    },
    assets: ['./src/assets/fonts'],
};