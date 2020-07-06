import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  ImageStyle,
  ViewStyle,
  ImageProps,
  ImageBackground,
  ImageBackgroundProps,
  ImageSourcePropType,
} from 'react-native';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground,
);

interface ProgressiveImageStyle {
  imageOverlay: ImageStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<ProgressiveImageStyle>({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
  },
});

interface ProgressiveImageProps extends ImageProps {
  thumbnailSource?: ImageSourcePropType;
  source: ImageSourcePropType;
  style: ImageStyle;
}

interface ProgressiveImageBackgroundProps extends ImageBackgroundProps {
  thumbnailSource?: ImageSourcePropType;
  source: ImageSourcePropType;
  style: ImageStyle;
}

class ProgressiveImageBackground extends React.Component<
  ProgressiveImageProps | ProgressiveImageBackgroundProps
> {
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = (): void => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  };

  onImageLoad = (): void => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  };

  render(): JSX.Element {
    const { thumbnailSource, source, style, ...props } = this.props;
    if (!thumbnailSource) {
      return (
        <View style={styles.container}>
          <AnimatedImageBackground
            {...props}
            source={source}
            style={[
              styles.imageOverlay,
              { opacity: this.imageAnimated },
              style,
            ]}
            onLoad={this.onImageLoad}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <AnimatedImageBackground
          {...props}
          source={thumbnailSource}
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <AnimatedImageBackground
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}

class ProgressiveImage extends React.Component<
  ProgressiveImageProps | ProgressiveImageBackgroundProps
> {
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = (): void => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  };

  onImageLoad = (): void => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  };

  render(): JSX.Element {
    const { thumbnailSource, source, style, ...props } = this.props;
    if (!thumbnailSource) {
      return (
        <View style={styles.container}>
          <AnimatedImage
            {...props}
            source={source}
            style={[
              styles.imageOverlay,
              { opacity: this.imageAnimated },
              style,
            ]}
            onLoad={this.onImageLoad}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <AnimatedImage
          {...props}
          source={thumbnailSource}
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <AnimatedImage
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}

export default ProgressiveImage;
export { ProgressiveImageBackground };
