var PushNotification = require('react-native-push-notification');

PushNotification.localNotification({
  ticker: 'My Notification Ticker', // (optional)
  autoCancel: false, // (optional) default: true
  largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
  smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
  subText: 'This is a subText', // (optional) default: none
  priority: 'high', // (optional) set notification priority, default: highate
  importance: 'default', // (optional) set notification importance, default: high
  allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
});
