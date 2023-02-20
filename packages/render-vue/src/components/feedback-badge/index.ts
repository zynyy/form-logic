import FeedbackBadge from './FeedbackBadge';


export default FeedbackBadge;


declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FeedbackBadge: typeof FeedbackBadge;
  }
}
