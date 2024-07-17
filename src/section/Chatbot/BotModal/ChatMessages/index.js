import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { makeStyles } from "@material-ui/core";
import { Avatar, Button, Grid, Link, Typography } from "@mui/material";
import CustFormdata from "./JsonUI/CustFormdata";
import ChatOptions from "./JsonUI/ChatOptions";
import { themeConfig } from "../../../../theme/themesConfig";
import DateSelection from "./JsonUI/DateSelection";
import _ from "lodash";
import TimeSlot from "./JsonUI/TimeSlot";
import BotApi from "../../../../service/BotApi";
import useAuth from "../../../../Utils/Hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PropagateLoader } from "react-spinners";
import secureLocalStorage from "react-secure-storage";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "inline-flex",
    padding: "4px 8px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: "0px 8px 8px 8px",
    background: "#ECEEF5",
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
      whiteSpace: "pre-line",
      lineHeight: "18px",
    },
  },
  conditionalCard: {
    display: "inline-flex",
    padding: "8px 12px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: "0px 8px 8px 8px",
    background: themeConfig?.palette.lyfngo.primary.main,
    maxWidth: 280,
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
      color: "#fff",
      lineHeight: "18px",
    },
  },
  messageContainer: {
    padding: "24px 18px",
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ECEEF5",
    margin: "0 4px",
  },
  textContainer: {
    display: "flex",
    gap: 4,
    // alignItems: 'center',
    marginBottom: 12,
  },
  restBtn: {
    display: "flex",
    justifyContent: "center",
    "&.MuiButtonBase-root": {
      border: `1px solid ${themeConfig?.palette?.lyfngo?.primary?.main}`,
      color: themeConfig?.palette?.lyfngo?.primary?.main || "#cccccc",
      textTransform: "capitalize",
      fontFamily: "poppins",
      display: "flex",
      fontSize: 11,
      padding: 0,
      width: "70px",
      [theme.breakpoints.down("xs")]: {
        fontSize: 11,
      },
      alignItems: "center",
      gap: "4px",
      borderRadius: 20,
      "&:hover": {
        background: themeConfig?.palette?.lyfngo?.primary?.main,
        color: themeConfig?.palette?.lyfngo?.light?.main,
        transition: ".5s ease",
      },
    },
  },
}));

const ChatMessages = (props) => {
  const classes = useStyles();
  const { messages, setMessages, loading, setLoading, saveLoggedChats } = props;
  const {
    domainData,
    setBotName,
    setBotNum,
    groupName,
    setReady,
    ready,
    bot_custUuid,
    setBotCustId,
    bot_cheadId,
    setBotCheadId,
    aiStatus,
    aiSetStatus,
    setAICount,
    custName,
    token,
    custUuid,
    mobileNumber,
    country,
  } = useAuth();
  // const [loggedChats, setLoggedChats] = useState([])
  const initialMessages = [
    {
      name: "WelcomeMessages",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Hi, Welcome to ${domainData?.tentName + "!"} 🏥`,
      },
    },
    {
      name: "AI-Intro",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Please provide your information to engage with an AI-powered chatbot experience. 🤖💡`,
      },
    },
    {
      name: "NameMobileForm",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {},
    },
    {
      name: "OptionSelection",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: "Thank you for provided details",
      },
    },
    {
      name: "ChooseChatOption",
      type: "bot",
      jsonType: "NonCard",
      component: "",
      data: {},
    },
    {
      name: "DateChoose",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: "Please choose the appointment data",
      },
    },
    {
      name: "DateSelection",
      type: "bot",
      jsonType: "NonCard",
      component: "",
      data: {},
    },
    {
      name: "TimeSlotSelection",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {},
    },
    {
      name: "SuccessConfirmation",
      type: "bot",
      jsonType: "card",
      component: "SuccessConfirmation",
      data: {},
    },
    {
      name: "ChatAgainButton",
      type: "bot",
      jsonType: "card",
      component: "ChatAgainButton",
      data: {},
    },
  ];

  const loggedMessages = [
    {
      name: "CustWelcome",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Hi, ${custName}`,
      },
    },
    {
      name: "tentWelcome",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Welcome to ${domainData?.tentName + "!"} 🏥`,
      },
    },
    {
      name: "NameMobileForm",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {},
    },
    {
      name: "chooseOptions",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Please choose below option to continue`,
      },
    },
    {
      name: "ChooseChatOption",
      type: "bot",
      jsonType: "NonCard",
      component: "",
      data: {},
    },
  ];

  // logged user chats
  // useEffect(() => {
  // 	if (token !== null && custUuid) {
  // 		setLoading(true)
  // 		const onSuccess = (res) => {
  // 			setLoading(false)
  // 			const combinedData = [...loggedMessages, ...res?.data?.data]
  // 			setLoggedChats(combinedData)
  // 		}
  // 		const onFailure = () => {
  // 			setLoading(false)
  // 		}
  // 		BotApi.getSavedChats(custUuid).then(onSuccess, onFailure)
  // 	}
  // }, [token, custUuid])

  let intialValue = [
    {
      NameMobileForm: {
        name: "",
        mobile: "",
        country: "",
      },
      ChooseChatOption: {
        bookDemo: false,
        chatUs: false,
      },
      demoDate: "",
    },
  ];
  const [moblen, setMoblen] = useState(null);
  const [bookModes, setBookModes] = useState("");
  const [defaultTentuser, setDefaultTentuser] = useState();
  const [availSlot, setAvailslot] = useState([]);
  const [currentState, setCurrentState] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const schema = yup.object().shape({
    name: yup.string().required("Please enter your name"),
    phoneNum: yup
      .string()
      .required("Please enter the mobile number")
      .matches(/^([1-9][0-9]*)?$/, "Please enter the valid mobile number")
      .min(moblen, `Mobile number should be minimum ${moblen} digits`)
      .max(moblen, `Must be exactly ${moblen} digits`),
    terms: yup.bool().oneOf([true], "Please accept the terms and conditions"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const onSuccess = (res) => {
      if (res?.data?.status === "success") {
        const modeNameFilter = res?.data?.data[0];
        if (_.isEqual(modeNameFilter, "Home")) {
          setBookModes("at-home");
        } else if (_.isEqual(modeNameFilter, "In-person")) {
          setBookModes("at-clinic");
        } else {
          setBookModes("on-line");
        }
      }
    };
    const onFailure = (err) => {
      setBookModes("");
      console.log(err);
    };
    BotApi.getBookingModes({ tentId: domainData?.mastTentUuid }).then(
      onSuccess,
      onFailure
    );
  }, [domainData?.mastTentUuid]);

  useEffect(() => {
    const onSuccess = (res) => {
      if (res?.data?.status === "success") {
        setDefaultTentuser(res?.data?.data[0]?.tentUserUuid || "");
      }
    };
    const onFailure = (err) => {
      // setBookModes('')
      console.log(err);
    };
    !_.isEmpty(bookModes) &&
      BotApi.getTentuser({
        tentId: domainData?.mastTentUuid,
        appointmentMode: bookModes,
      }).then(onSuccess, onFailure);
  }, [bookModes, domainData?.mastTentUuid]);

//   useEffect(() => {
//     if (messages && document.getElementById("msgChatBot")) {
//       const element = document.getElementById("msgChatBot");
//       element.scrollTop = element.scrollHeight;
//       setMessages(messages);
//     }
//   }, [messages]);

  useEffect(() => {
	console.log('rendered')
    const localData =
      typeof window !== "undefined" ? localStorage.getItem("chatState") : null;
    const savedState = localData ? JSON.parse(localData, reviver) : null;
    const savedTime =
      typeof window !== "undefined"
        ? localStorage.getItem("chatStateTime")
        : null;
    const currentTime = new Date().getTime();
    const expirationTime = 2 * 60 * 60 * 1000;
    if (
      savedState &&
      !_.isEmpty(savedState?.messages) &&
      currentTime - savedTime <= expirationTime
    ) {
      setMessages(savedState?.messages);
    } else {
      const addInitialMessages = async () => {
        const initialMessagesToAdd = [];
        for (let i = 0; i < Math.min(initialMessages.length, 3); i++) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          initialMessagesToAdd.push(initialMessages[i]);
          setMessages((prevMessages) => [...prevMessages, initialMessages[i]]);
        }
        const chatState = { messages: initialMessagesToAdd };
        localStorage.setItem("chatState", JSON.stringify(chatState, replacer));
        localStorage.setItem("chatStateTime", currentTime);
      };
      addInitialMessages();
    }
  }, []);

  console.log("message", messages);

  useEffect(() => {
    const localInitializedData =
      typeof window !== "undefined"
        ? localStorage.getItem("reinitialized")
        : null;
    const savedState = localInitializedData
      ? JSON.parse(localInitializedData)
      : null;
    const savedTime =
      typeof window !== "undefined"
        ? localStorage.getItem("chatStateTime")
        : null;
    const currentTime = new Date().getTime();
    const expirationTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    if (token !== null) {
      console.log("logged chats");
    } else {
      if (
        savedState &&
        !_.isEmpty(savedState) &&
        currentTime - savedTime <= expirationTime
      ) {
        setCurrentState(savedState);
      } else {
        setCurrentState(intialValue);
        localStorage.setItem("reinitialized", JSON.stringify(intialValue));
      }
    }
  }, [token]);

  const replacer = (key, value) => {
    if (key === "component" && typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  const reviver = (key, value) => {
    if (key === "component" && typeof value === "string") {
      return value;
    }
    return value;
  };

  const bookDemo = () => {
    aiSetStatus(false);
    secureLocalStorage.setItem("AIstatus", false);
    setAICount(0);
    secureLocalStorage.setItem("AIsentCount", 0);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: "Book-demo",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: "Book Appointment",
        },
      },
      {
        name: "DateSelection",
        type: "bot",
        jsonType: "card",
        component: "DateSelection",
        data: {
          message: "Please choose the appointment data",
        },
      },
      {
        name: "DateSelection",
        type: "bot",
        jsonType: "NonCard",
        component: "",
        data: {},
      },
    ]);
    // saveLoggedChats([
    // 	{
    // 		name: 'Book-demo',
    // 		type: 'cust',
    // 		jsonType: 'card',
    // 		component: '',
    // 		data: {
    // 			message: 'Book Appointment',
    // 		},
    // 	},
    // 	{
    // 		name: 'DateSelection',
    // 		type: 'bot',
    // 		jsonType: 'card',
    // 		component: 'DateSelection',
    // 		data: {
    // 			message: 'Please choose the appointment data',
    // 		},
    // 	},
    // 	{
    // 		name: 'DateSelection',
    // 		type: 'bot',
    // 		jsonType: 'NonCard',
    // 		component: '',
    // 		data: {},
    // 	},
    // ])
    setCurrentState((prevState) => [
      {
        ...prevState[0],
        ChooseChatOption: {
          ...prevState[0]?.ChooseChatOption,
          bookDemo: true,
        },
      },
    ]);
  };

  const chatUs = (data, chead_id) => {
    setLoading(true);
    const onSuccess = () => {
      setLoading(false);
      setReady(true);
      secureLocalStorage.setItem("readystate", true);
      aiSetStatus(false);
      secureLocalStorage.setItem("AIstatus", false);
      setAICount(0);
      secureLocalStorage.setItem("AIsentCount", 0);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "ChatUs",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: data,
          },
        },
        {
          name: "waitReqest",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message:
              "Request sent to the advisor, Please wait for the connection. Request valid upto 24hours.",
          },
        },
      ]);
      // saveLoggedChats([
      // 	{
      // 		name: 'ChatUs',
      // 		type: 'cust',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: data,
      // 		},
      // 	},
      // 	{
      // 		name: 'waitReqest',
      // 		type: 'bot',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: 'Request sent to the advisor, Please wait for the connection. Request valid upto 24hours.',
      // 		},
      // 	},
      // ])
    };
    const onFailure = () => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "RequestFailure",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Internal Error. Try again or please try after sometime",
          },
        },
      ]);
      // saveLoggedChats([
      // 	{
      // 		name: 'RequestFailure',
      // 		type: 'bot',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: 'Internal Error. Try again or please try after sometime',
      // 		},
      // 	},
      // ])
    };
    if (chead_id !== null && token !== null) {
      BotApi.waitRequest(chead_id).then(onSuccess, onFailure);
    } else {
      bot_cheadId && BotApi.waitRequest(bot_cheadId).then(onSuccess, onFailure);
    }
  };

  const loggedInChead = (labelData) => {
    const body = {
      Name: custName,
      Phone: "+" + country?.mastLookupKey + mobileNumber,
      Type: "micro_bot",
      MastTentUuid: domainData?.mastTentUuid,
      // terms: data?.terms,
      custUuid: custUuid,
    };
    setLoading(true);
    const onSuccess = (res) => {
      secureLocalStorage.setItem("botName", custName);
      setBotName(custName);
      secureLocalStorage.setItem("botNum", mobileNumber);
      setBotNum(mobileNumber);
      localStorage.setItem("bot_custUuid", res?.data?.data?.cust_uuid);
      setBotCustId(res?.data?.data?.cust_uuid);
      localStorage.setItem("bot_cheadId", res?.data?.data?.chead_id);
      setBotCheadId(res?.data?.data?.chead_id);
      setLoading(false);
      chatUs(labelData, res?.data?.data?.chead_id);
    };
    const onFailure = (err) => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "CheadErr",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Internal Error. Please try again.",
          },
        },
      ]);
    };
    custUuid && BotApi.getLeadDetails(body).then(onSuccess, onFailure);
  };

  const aiChat = () => {
    aiSetStatus(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: "Powered-AI",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: "AI Q&A",
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: "Welcome to Health AI by Kauvery Hospital!",
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `Discover Health Insights with Kauvery's AI Assistant!`,
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `How can I help you today!`,
        },
      },
      // saveLoggedChats([
      // 	{
      // 		name: 'Powered-AI',
      // 		type: 'cust',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: 'AI Q&A',
      // 		},
      // 	},
      // 	{
      // 		name: 'bot_msg',
      // 		type: 'bot',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: 'Welcome to Health AI by Kauvery Hospital!',
      // 		},
      // 	},
      // 	{
      // 		name: 'bot_msg',
      // 		type: 'bot',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: `Discover Health Insights with Kauvery's AI Assistant!`,
      // 		},
      // 	},
      // 	{
      // 		name: 'bot_msg',
      // 		type: 'bot',
      // 		jsonType: 'card',
      // 		component: '',
      // 		data: {
      // 			message: `How can I help you today!`,
      // 		},
      // 	},
      // ]),
    ]);
  };

  // Update local storage whenever messages state changes
  useEffect(() => {
    localStorage.setItem("reinitialized", JSON.stringify(currentState));
  }, [currentState]);

  const resetChat = () => {
    const currentTime = new Date().getTime();
    let defaultState = [
      {
        name: "WelcomeMessages",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `Hi, Welcome to ${domainData?.tentName + "!"}`,
        },
      },
      {
        name: "AI-Intro",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `Please provide your information to engage with an AI-powered chatbot experience at Kauvery Hospital 🏥`,
        },
      },
      {
        name: "NameMobileForm",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {},
      },
    ];
    const diffLogged = token !== null ? loggedMessages : defaultState;
    // if (!_.isEmpty(botNum)) {
    // 	localStorage.setItem('chatState', defaultState)
    // 	setMessages([
    // 		{
    // 			name: 'WelcomeMessages',
    // 			type: 'bot',
    // 			jsonType: 'card',
    // 			component: '',
    // 			data: {
    // 				message: `Hi, Welcome to ${domainData?.tentName + '!'}`,
    // 			},
    // 		},
    // 		{
    // 			name: 'NameMobileForm',
    // 			type: 'bot',
    // 			jsonType: 'card',
    // 			component: '',
    // 			data: {},
    // 		},
    // 		{
    // 			name: 'OptionSelection',
    // 			type: 'bot',
    // 			jsonType: 'card',
    // 			component: '',
    // 			data: {
    // 				message: 'Thank you for provided details',
    // 			},
    // 		},
    // 		{
    // 			name: 'ChooseChatOption',
    // 			type: 'bot',
    // 			jsonType: 'NonCard',
    // 			component: '',
    // 			data: {},
    // 		},
    // 	])
    // 	localStorage.setItem('reinitialized', intialValue)
    // 	setCurrentState(intialValue)
    // } else {
    // }
    localStorage.setItem("chatState", diffLogged);
    setMessages(diffLogged);
    token !== null ? "persisted" : reset();
    localStorage.setItem("reinitialized", {
      NameMobileForm: {
        name: "",
        mobile: "",
        country: "",
      },
      ChooseChatOption: {
        bookDemo: false,
        chatUs: false,
      },
      demoDate: "",
    });
    setCurrentState({});
    localStorage.setItem("chatStateTime", currentTime);
    secureLocalStorage.setItem("readystate", false);
    setReady(false);
    localStorage.setItem("bot_cheadId", null);
    setBotCheadId(null);
    localStorage.setItem("bot_custUuid", null);
    setBotCustId(null);
    secureLocalStorage.setItem("botName", null);
    setBotName(null);
    secureLocalStorage.setItem("botNum", null);
    setBotNum(null);
  };

  useEffect(() => {
    reset({
      name: "",
      phoneNum: "",
    });
  }, [reset]);

  return (
    <Grid
      container
      direction="column"
      className={classes.messageContainer}
      ref={bottomRef}
    >
      <React.Fragment>
        {messages?.map((cmp, index) => {
          if (cmp?.jsonType === "card") {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.2, delay: index * 0.1 }}
                className={classes.textContainer}
                style={{
                  flexDirection: cmp?.type !== "bot" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  className={classes.avatar}
                  style={{ display: cmp?.type !== "bot" ? "none" : "block" }}
                  src={
                    domainData?.tentLogoDoc
                      ? domainData?.tentLogoDoc
                      : _.isEqual(groupName, "health care")
                      ? "https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Care.svg"
                      : "https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Non_Care.svg"
                  }
                />
                <div
                  className={
                    cmp?.type !== "bot" ? classes.conditionalCard : classes.card
                  }
                >
                  {!_.isEmpty(cmp?.data) ? (
                    <MessageComponent data={cmp?.data?.message} />
                  ) : _.isEqual(cmp?.name, "NameMobileForm") ? (
                    <CustFormdata
                      setMessages={setMessages}
                      // saveLoggedChats={saveLoggedChats}
                      currentState={currentState}
                      setCurrentState={setCurrentState}
                      setBotCheadId={setBotCheadId}
                      setBotCustId={setBotCustId}
                      moblen={moblen}
                      setMoblen={setMoblen}
                      register={register}
                      handleSubmit={handleSubmit}
                      errors={errors}
                      reset={reset}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  ) : null}
                </div>
              </motion.div>
            );
          } else {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={classes.textContainer}
                style={{
                  flexDirection: cmp?.type !== "bot" ? "row-reverse" : "row",
                }}
              >
                {_.isEqual(cmp?.name, "ChooseChatOption") ||
                _.isEqual(cmp?.name, "AdvisorOption") ||
                _.isEqual(cmp?.name, "Advisor-In-AI") ? (
                  <ChatOptions
                    bookDemo={bookDemo}
                    chatUs={chatUs}
                    loggedInChead={loggedInChead}
                    currentState={currentState}
                    cmpName={cmp?.name}
                    aiChat={aiChat}
                  />
                ) : _.isEqual(cmp?.name, "DateSelection") ? (
                  <DateSelection
                    setMessages={setMessages}
                    // saveLoggedChats={saveLoggedChats}
                    defaultTentuser={defaultTentuser}
                    bookModes={bookModes}
                    availSlot={availSlot}
                    setAvailslot={setAvailslot}
                    domainData={domainData}
                    setCurrentState={setCurrentState}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setLoading={setLoading}
                  />
                ) : _.isEqual(cmp?.name, "SlotSelection") ? (
                  <TimeSlot
                    setMessages={setMessages}
                    // saveLoggedChats={saveLoggedChats}
                    availSlot={availSlot}
                    bookModes={bookModes}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    domainData={domainData}
                    defaultTentuser={defaultTentuser}
                    setLoading={setLoading}
                  />
                ) : (
                  <></>
                )}
              </motion.div>
            );
          }
        })}
      </React.Fragment>
      {loading && <Loader />}
      {!loading && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            bottom: "-20px",
          }}
        >
          <Button className={classes.restBtn} onClick={resetChat}>
            Reset Chat
          </Button>
        </motion.div>
      )}
    </Grid>
  );
};

export default ChatMessages;

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PropagateLoader
        size={8}
        color={themeConfig.palette.lyfngo.primary.main}
      />
    </div>
  );
};

const MessageComponent = ({ data }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const renderMessageWithLinks = (message) => {
    return message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              wordBreak: "break-word",
              fontWeight: 500,
              color: "#3d9fff",
            }}
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return <Typography variant="h3">{renderMessageWithLinks(data)}</Typography>;
};
