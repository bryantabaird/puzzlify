import { CreateGroupParams, createUserGroup } from "../helpers/cognito";

type AddUserGroupParams = CreateGroupParams;

export const addUserGroup = async (params: AddUserGroupParams) => {
  try {
    const response = await createUserGroup(params);

    return response;
  } catch (error) {
    const errorMessage = "Failed to add user group";
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};
