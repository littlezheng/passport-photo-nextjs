const issueToMessage: Record<string, string> = {
  ISSUE_HEAD_YAW_OVER_THRESHOLD:
    "Your face is not fully facing the front, which may lead to rejection. Please look directly at the camera, and if possible, have someone else take the photo for you.",
  ISSUE_HEAD_PITCH_OVER_THRESHOLD:
    "Your face is not fully facing the front, which may lead to rejection. Please look directly at the camera, and if possible, have someone else take the photo for you.",
  ISSUE_500: "Something wrong. Please try a different photo.",
  ISSUE_BACKEND: "Something went wrong. Please try again.",
  ISSUE_BOTTOM_NOT_FULL:
    "Empty space found in the bottom of the photo, or your shoulders were not correctly included. \n This is because your camera is too close to you. \n Please take a new photo to include your entire upper body. Good to have someone to take the photo for you.",
  ISSUE_EXPRESSION_NOT_NEUTRAL:
    "Expression not neutral. Please maintain a neutral expression. A small smile is acceptable.",
  ISSUE_EYEGLASSES_NOT_ALLOWED:
    "Eyeglasses is not allowed in this use case. Please remove your eyeglasses.",
  ISSUE_FACE_BRIGHTNESS_BAD:
    "Lighting condition is not good. Please ensure the lighting is adequate. Taking the photo while facing a light source often yields the best results. Thank you for your attention to this detail.",
  ISSUE_FACE_LIGHT_NOT_BALANCE:
    "Lighting on face is not balance. The issue is due to the light source being at your side. We suggest you take a new photo, facing directly towards the light source.",
  ISSUE_FACE_NOT_FOUND:
    "No face found. Please upload a photo with front face and upper body. We will make a qualified passport photo for you in seconds.",
  ISSUE_FACE_NOT_MATCH:
    "Not the same person. We sometimes make errors in detecting the same person. Feel free to try a different photo, place a new order (we will refund this one), or contact our support team.",
  ISSUE_HAT_NOT_ALLOWED: "Hat is not allowed.",
  ISSUE_IDPHOTO_SERVICE:
    "Please try another photo. See suggestions in last page.",
  ISSUE_LEFT_NOT_FULL:
    "Empty space found in the left of the photo, or your shoulders were not correctly included. \n This is because your camera is too close to you. \n Please take a new photo to include your entire upper body. Good to have someone to take the photo for you.",
  ISSUE_MASK_NOT_ALLOWED: "Mask is not allowed.",
  ISSUE_NOT_IN_PAYMENT_SUCCESS_STATUS:
    "Your payment has either not been processed or has been refunded. If you believe this to be an error, please reach out to our support team for assistance.",
  ISSUE_PHOTO_LOAD_FAILED:
    "Failed to process the photo. Please make sure network is good.",
  ISSUE_PHOTO_SHARPNESS_BAD:
    "The photo quality might not be optimal. Please ensure to take a clear photo. Tip: Proper brightness is crucial.",
  ISSUE_RIGHT_NOT_FULL:
    "Empty space found in the right of the photo, or your shoulders were not correctly included. \n This is because your camera is too close to you. \n Please take a new photo to include your entire upper body. Good to have someone to take the photo for you.",
  ISSUE_UNKNOWN: "Something went wrong. Please try again.(Issue Unknown)",
};

export const getIssueMessage = (issue: string) => {
  const msg = issueToMessage[issue];

  return msg ?? issue;
};
