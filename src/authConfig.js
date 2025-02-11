export const msalConfig = {
    auth: {
      clientId: "832f193a-f669-4080-ae1b-f6e43e9de065",
      authority: "https://login.chinacloudapi.cn/ee02fc79-a0ad-44bc-b47d-03d0491fbe48",
      redirectUri: "http://localhost:3000/auth/callback",
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
    scopes: ["User.Read"]
  };

  export const apiManagementRequest = {
    scopes: ["api://722420c2-019d-42e7-ab80-bf0af62417c8/.default"]
  };

  export const userScpoe = {
    scopes: ["https://microsoftgraph.chinacloudapi.cn/.default"]
  };
const secret = "g-GRf.O~0x4N6R5gZQ68o~C4dQ.Sy1u_n6"
