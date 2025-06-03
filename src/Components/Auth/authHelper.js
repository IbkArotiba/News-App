import CryptoJS from 'crypto-js';

const CLIENT_SECRET = import.meta.env.VITE_AWS_CLIENT_SECRET;
const CLIENT_ID = import.meta.env.VITE_AWS_CLIENT_ID;

// Function to generate SECRET_HASH
export const generateSecretHash = (username) => {
  const message = username + CLIENT_ID;
  const secretHash = CryptoJS.HmacSHA256(message, CLIENT_SECRET);
  return CryptoJS.enc.Base64.stringify(secretHash);
};

// We need to use the lower-level Cognito Identity Provider API
// because Amplify v6 doesn't properly support SECRET_HASH

import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION
});

// Custom sign up function using AWS SDK directly
export const signUpWithSecret = async (email, password, name) => {
  const secretHash = generateSecretHash(email);
  
  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    SecretHash: secretHash,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'name',
        Value: name
      }
    ]
  });

  try {
    const response = await cognitoClient.send(command);
    return {
      isSignUpComplete: false,
      userId: response.UserSub,
      nextStep: {
        signUpStep: 'CONFIRM_SIGN_UP'
      }
    };
  } catch (error) {
    throw error;
  }
};

// Custom confirm sign up function using AWS SDK directly
export const confirmSignUpWithSecret = async (email, confirmationCode) => {
  const secretHash = generateSecretHash(email);
  
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: confirmationCode,
    SecretHash: secretHash
  });

  try {
    const response = await cognitoClient.send(command);
    return {
      isSignUpComplete: true,
      nextStep: null
    };
  } catch (error) {
    throw error;
  }
};

// Custom sign in function using AWS SDK directly
export const signInWithSecret = async (email, password) => {
  const secretHash = generateSecretHash(email);
  
  const command = new InitiateAuthCommand({
    ClientId: CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  });

  try {
    const response = await cognitoClient.send(command);
    
    if (response.AuthenticationResult) {
      return {
        isSignedIn: true,
        nextStep: null,
        tokens: response.AuthenticationResult
      };
    } else {
      // Handle challenge responses if needed
      return {
        isSignedIn: false,
        nextStep: response.ChallengeName
      };
    }
  } catch (error) {
    throw error;
  }
};