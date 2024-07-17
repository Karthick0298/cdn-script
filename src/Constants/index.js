export const API_ENDPOINTS = {
  //Lead details from BOT
  GET_USER_CHATS: `/communication/microbot/chats/get/cust_data/:custUuid`,
  POST_USER_CHATS: `/communication/microbot/chats/update/chat_data/:custUuid`,
  CONNECT_REQUEST: `/communication/consult/connect/request`,
  GET_BOOK_MODES: `/ms-calendar-appointment/appointment/appointmentModes`,
  GET_TENTUSER_LIST: `/ms-communication/tentUserDetails/appointmentUsers`,
  CHAT_REQUEST: `/communication/microbot/chats/update/chead/:cheadId`,
  CREATE_CHAT_SESSION: "communication/llm/save/session",
  CHAT_SEND_MSG: `chat/stream`,
  RESET_CHAT: `chat/message/clear`,
  GET_FAQ: "/communication/llm/QandA/get",
  POST_EMAIL_REQUEST: "communication/consult/micribot/email/request/",
  POST_FEEDBACK_UPLOAD: "node/feedback/microsite/savefeedback/:tentId",
  LOOK_UP_BOT_DIAL: '/communication/lookup/index/mastLookupType/AVL/',
	AVAILABLE_APPOINTMENT: '/ms-calendar-appointment/appointment/careTimeSlot',


  GOOGLE_MEET_LINK_APPOINTMENT: "/communication/meeting/googlemeet/",
  CANCEL_APPOINTMENT: "/ms-calendar-appointment/appointment/cancel",
  RESCHEDULE_APPOINTMENT: "/ms-calendar-appointment/appointment/reschedule",

  APPOINTMENT_POST: "/ms-calendar-appointment/appointment/add",
  B2B_PROFILE_PAGE_DATA: "/profiles/b2c/microSite",
};
