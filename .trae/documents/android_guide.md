# 📱 散步 (Sanpo) - Android App 版

本文档旨在说明如何构建、安装和发布 Sanpo 的 Android 应用程序版本。

## 🚀 简介

Sanpo App 基于 [Capacitor](https://capacitorjs.com/) 构建，它将我们现有的 React Web 应用封装在一个原生的 Android 容器中。这意味着：
*   **一致的体验**：App 版拥有与 Web 版完全一致的界面和功能。
*   **原生性能**：可以直接调用原生 API（如果未来需要）。
*   **离线可用**：内置资源，加载速度更快，无需网络也可使用基础功能。

## 🛠️ 构建指南

### 前置要求
*   [Node.js](https://nodejs.org/) (已安装)
*   [Android Studio](https://developer.android.com/studio) (用于构建 APK)

### 快速构建步骤

1.  **更新 Web 资源**
    每次修改前端代码后，都需要运行此命令来更新 App 的资源：
    ```powershell
    npm run build
    npx cap sync
    ```

2.  **生成 APK**
    *   打开 Android Studio。
    *   选择 `Open`，打开项目目录下的 `android` 文件夹。
    *   等待 Gradle 同步完成。
    *   点击菜单栏 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`。
    *   构建完成后，点击提示框中的 `locate` 即可找到 APK 文件。

3.  **直接运行到手机**
    连接手机并开启 USB 调试模式，在终端运行：
    ```powershell
    npx cap run android
    ```

## 📦 版本信息

*   **包名 (Package ID)**: `com.sanpo.app`
*   **应用名称**: `Sanpo`
*   **当前版本**: 1.0.0

## 🎨 图标修改

App 图标位于 `android/app/src/main/res/` 目录下。
如果您想更换图标，最简单的方法是：
1.  准备一张 `1024x1024` 的 `icon.png`。
2.  使用 `cordova-res` 或 Android Studio 自带的 **Image Asset Studio** 工具自动生成各种尺寸的图标。

## ❓ 常见问题

**Q: App 版和网页版有什么区别？**
A: 功能上没有区别。App 版是一个安装包 (.apk)，可以直接安装在安卓手机上，不需要通过浏览器访问。App 版启动速度更快，且没有浏览器的地址栏干扰，沉浸感更强。

**Q: 如何更新 App？**
A: 如果只是前端代码更新（如修改文字、样式），您可以利用 Capacitor 的热更新机制（需要额外配置 Ionic Appflow），或者重新构建 APK 并覆盖安装。
