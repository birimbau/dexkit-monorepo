export interface CommerceContainerState {
  params: { [key: string]: string };
  containerId: string;
  setContainer: (
    containerId: string,
    params?: { [key: string]: string }
  ) => void;
  set: (key: string, value: string) => void;
  get: (key: string) => string;
  goBack: () => void;
}
