import {
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  CreateGroupCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  endpoint: "http://localhost:4566",
  region: "us-west-2",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

export type CreateGroupParams = {
  groupName: string;
  description?: string;
};

export const createUserGroup = async (params: CreateGroupParams) => {
  const userPoolId = process.env.COGNITO_USER_POOL_APP_CLIENT_ID;

  if (!userPoolId) {
    throw new Error("User Pool ID not found");
  }

  try {
    const createGroupCommandInput: CreateGroupCommandInput = {
      GroupName: params.groupName,
      UserPoolId: userPoolId,
      Description: params.description,
    };

    const createGroupCommand = new CreateGroupCommand(createGroupCommandInput);
    const response = await cognitoClient.send(createGroupCommand);

    console.log(
      `Group "${params.groupName}" created successfully in User Pool "${userPoolId}"`,
    );
    return response;
  } catch (error) {
    console.error("Error creating user group:", error);
    throw error;
  }
};
