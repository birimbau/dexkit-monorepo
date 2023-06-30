let access_token: string | undefined;
let refreshedWasCalled = false;

export function getAccessToken() {
  if (access_token) {
    return access_token;
  }

}