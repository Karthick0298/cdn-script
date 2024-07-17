"use client";
import { createContext, useCallback, useEffect, useState } from "react";
import { updateThemeColor } from "../../theme/themesConfig";
import homePageApi from "../../service/HomePage/index";
import { decryption, encryption, failureLogin } from "../Aes";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { usePathname } from "next/navigation";
import _ from "lodash";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const pathname = usePathname();
  // console.log('pathname', pathname, pathname === '/membership/success')
  const [domainData, setDomainData] = useState({});
  const [isOpenAppointment, setIsOpenAppointment] = useState(false);
  const [BookNowBtnClick, setBookNowBtnClick] = useState(false);
  const [country, setCountry] = useState(null);
  const [secondaryCountry, setSecondaryCountry] = useState(null);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  // const [userLogo, setUserLogo] = useState(logo);

  const [loading, setLoading] = useState(false);
  const [phoneUser, setPhoneUser] = useState(null);
  // const [locDetails, setLocDetails] = useState();
  const [getProfilePic, setGetProfilePic] = useState(null);

  const mastuuid =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("mastUuid")
      : null;
  const [mastUuid, setMastUuid] = useState(mastuuid);

  const tentUserUuid =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("tentUserUuid")
      : null;
  const userId =
    typeof window !== "undefined" ? secureLocalStorage.getItem("userId") : null;

  const custId =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("custUuid")
      : null;
  const tentUuid =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("tentUuid")
      : null;
  const themeColor =
    typeof window !== "undefined" ? localStorage.getItem("themeColor") : null;

  const [custUuid, setCustUuid] = useState(custId);
  const userName =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("custName")
      : null;
  const apptBookingCustomer =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("apptBookingCust")
      : null;
  const mobileNumber =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("mobileNumber")
      : null;
  const countryCode =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("countryCode")
      : null;
  const tentGroupName =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("groupName")
      : null;

  const isBotflow =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("botFlow")
      : null;
  const getSocketConnection =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("socketstatus")
      : null;
  const getReadyState =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("readystate")
      : null;
  const getCheadId =
    typeof window !== "undefined" ? localStorage.getItem("bot_cheadId") : null;
  const getBotCustId =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("bot_custUuid")
      : null;
  const getBotName =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("botName")
      : null;
  const getBotNum =
    typeof window !== "undefined" ? secureLocalStorage.getItem("botNum") : null;
  const getBotEmail =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("botEmail")
      : null;
  const getAIstatus =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("AIstatus")
      : null;
  const getAIcount =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("AIsentCount")
      : null;
  const userUuid =
    typeof window !== "undefined"
      ? secureLocalStorage.getItem("userUuid")
      : null;

  const [custName, setCustName] = useState(userName);
  const [apptBookingCustName, setApptBookingCustName] =
    useState(apptBookingCustomer);
  const [groupName, setGroupName] = useState(tentGroupName);
  const [isBot, setIsBot] = useState(isBotflow);
  const [botName, setBotName] = useState(getBotName);
  const [botNum, setBotNum] = useState(getBotNum);
  const [botEmail, setBotEmail] = useState(getBotEmail);
  const [ready, setReady] = useState(getReadyState);
  const [socket, setSocket] = useState(getSocketConnection);
  const [bot_custUuid, setBotCustId] = useState(getBotCustId);
  const [bot_cheadId, setBotCheadId] = useState(getCheadId);
  const [aiStatus, aiSetStatus] = useState(getAIstatus);
  const [aiCount, setAICount] = useState(getAIcount);
  // const [mobileNumber, setMobileNumber] = useState(userMobileNUmber);
  // const [countryCode, setCountryCode] = useState(userCountryCode);

  const getDomainDetails = useCallback(() => {
    setLoading(true);
    const onSuccess = (res) => {
      const successData = decryption(res);
      const themeColor = successData?.data?.themeColor;
      setDomainData(successData?.data);
      updateThemeColor(successData?.data?.themeColor);
      secureLocalStorage.setItem("domainData", successData?.data);
      localStorage.setItem("themeColor", themeColor);
      secureLocalStorage.setItem("mastUuid", successData?.data?.mastTentUuid);
      secureLocalStorage.setItem("groupName", successData?.data?.groupName);
      secureLocalStorage.setItem(
        "countryCode",
        successData?.data?.media?.tentCountryCode
      );
      secureLocalStorage.setItem("botFlow", successData?.data?.isBot);
      secureLocalStorage.setItem("userUuid", successData?.data?.userUuid);
      setIsBot(successData?.data?.isBot);
      setMastUuid(successData?.data?.mastTentUuid);
      setGroupName(successData?.data?.groupName);
      setLoading(false);
    };
    const onFailure = (err) => {
      setDomainData({});
      setLoading(false);
    };
    // homePageApi.LandingPageCount({ domainName: host ? host : hostName }).then(onSuccess, onFailure)
    homePageApi
      .LandingPageCount({ domainName: "khdemo.rigelsoftmail.in" })
      .then(onSuccess, onFailure);
  }, []);

  useEffect(() => {
    getDomainDetails();
  }, [getDomainDetails, updateThemeColor]);
  const token = null;
  return (
    <>
      <AuthContext.Provider
        value={{
          domainData,
          mastUuid,
          groupName,
          tentUserUuid,
          BookNowBtnClick,
          setBookNowBtnClick,
          apptBookingCustName,
          setApptBookingCustName,
          isOpenAppointment,
          country,
          setCountry,
          countryCodeOptions,
          setCountryCodeOptions,
          loading,
          setLoading,
          userId,
          getProfilePic,
          setGetProfilePic,
          custName,
          setCustName,
          setCustUuid,
          custUuid,
          secondaryCountry,
          setSecondaryCountry,
          tentUuid,
          mobileNumber,
          countryCode,
          themeColor,
          token,
          isBot,
          ready,
          setReady,
          socket,
          setSocket,
          bot_custUuid,
          setBotCustId,
          bot_cheadId,
          setBotCheadId,
          botName,
          setBotName,
          botNum,
          setBotNum,
          botEmail,
          setBotEmail,
          aiStatus,
          aiSetStatus,
          aiCount,
          setAICount,
          userUuid,
        }}
      >
        {children}
      </AuthContext.Provider>
      {/* <ToastContainer hideProgressBar={true} position='top-right' autoClose={3000} draggable style={{ top: '4.5em', fontFamily: 'Poppins' }} /> */}
    </>
  );
}

export default AuthContext;
