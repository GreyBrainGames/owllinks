import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';

export const isDevMode = (): boolean => {
  return localStorage.getItem("dev-mode") === "true";
};

export const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-1TBFXRLMWR']
    })
  ]
})
