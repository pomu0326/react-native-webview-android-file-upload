import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
  WebView,
  requireNativeComponent,
  NativeModules,
  Platform
} from "react-native";

const { CustomWebViewManager } = NativeModules;

/**
 * React Native's WebView on Android does not allow picture uploads. However, due to [this pull request](https://github.com/facebook/react-native/pull/15016) one can override parts of the built-in WebView to add hooks wherever necessary.
 *
 * This component will:
 *
 *   1. Use the built-in React Native WebView on iOS.
 *   2. Be a drop-in replacement for the Android WebView with the additional functionality for file uploads.
 *
 * This requires several Java files to work: CustomWebViewManager.java, CustomWebViewModule.java, and CustomWebViewPackage.java. Additionally, the MainApplication.java file needs to be edited to include the new package.
 *
 * Lots of guidance from [the example project for the original PR](https://github.com/cbrevik/webview-native-config-example) and from [a sample Android webview](https://github.com/hushicai/ReactNativeAndroidWebView).
 */
export default class CustomWebView extends Component {
  static propTypes = {
    ...WebView.propTypes,
    webviewRef: PropTypes.func
  };

  render() {
    const { webviewRef, ...props } = this.props;

    return (
      <WebView
        ref='CUSTOM_WEBVIEW'
        {...props}
        nativeConfig={this.getNativeConfig()}
      />
    );
  }
  
  goBack() {
    this.refs['CUSTOM_WEBVIEW'].goBack();
    return true;
  }

  getNativeConfig() {
    if (Platform.OS !== "android") {
      return null;
    }
    return {
      component: RCTCustomWebView,
      viewManager: CustomWebViewManager
    };
  }
}

const RCTCustomWebView = requireNativeComponent(
  "RCTCustomWebView",
  CustomWebView,
  WebView.extraNativeComponentConfig
);
