import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { CfnOutput } from "aws-cdk-lib";

export class CognitoConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new cognito.UserPool(this, "PuzzlifyUserPool", {
      userPoolName: "puzzlify-user-pool",
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        tenants: new cognito.StringAttribute({ mutable: true }),
        role: new cognito.StringAttribute({ mutable: true }),
      },
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "PuzzlifyUserPoolWebClient",
      {
        userPool: userPool,
        userPoolClientName: "puzzlify-web-client",
      },
    );

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "The Client ID for the Cognito User Pool",
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
      description: "The User Pool ID for the Cognito User Pool",
    });
  }
}
