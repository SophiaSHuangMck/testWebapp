import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest, apiManagementRequest,userScpoe } from "./authConfig";
import logo from './logo.svg';
import axios from 'axios';

function LoginSuccess() {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const [data, setData] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const handleGetData = () => {
    axios.get('https://ctetrans.azure-api.cn/ctetransbo/ConnectWithSqlServer', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
  };

  const fetchUserInfo = (token) => {
    axios.get('https://microsoftgraph.chinacloudapi.cn/v1.0/me/?$select=employeeId', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUserID(response.data.employeeId);
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
  };

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).then(
      res => {
        setIsInitialized(true);
      }
    ).
    catch(e => {
      console.error(e);
    });
  };

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await instance.initialize();
        if (!isAuthenticated){
          handleLogin();
        }else{
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeMsal();
  }, [instance]);

  useEffect(() => {
    if (isInitialized && accounts.length > 0) {
      const request = {
        ...apiManagementRequest,
        account: accounts[0]
      };

      instance.acquireTokenSilent(request).then(response => {
        setToken(response.accessToken);
      }).catch(error => {
        console.error(error);
        // Fallback to interactive method if silent token acquisition fails
        instance.acquireTokenPopup(request).then(response => {
          setToken(response.accessToken);
        }).catch(error => {
          console.error(error);
        });
      });

      const userRequest = {
        ...userScpoe,
        account: accounts[0]
      };

      instance.acquireTokenSilent(userRequest).then(response => {
        fetchUserInfo(response.accessToken);
      }).catch(error => {
        console.error(error);
        // Fallback to interactive method if silent token acquisition fails
        instance.acquireTokenPopup(userRequest).then(response => {
        }).catch(error => {
          console.error(error);
        });
      });
    }
  }, [instance,accounts,isInitialized]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <p>Welcome, {userID} {accounts[0] && accounts[0].name}!</p>
          {token ? <p>Connect to api Management and get Data.</p> : <p>Missing Token.</p>}
          {data.length > 0 && (
            <div>
              <p>API Data:</p>
              {data.map((item, index) => (
                <p key={index}>ID : {item.ID}, FirstName : {item.FirstName}, LastName : {item.LastName}</p>
              ))}
            </div>
          )}
          {token && <button onClick={handleGetData} className="loginBtn">Get Data</button>}
      </header>
    </div>
  );
}

export default LoginSuccess;