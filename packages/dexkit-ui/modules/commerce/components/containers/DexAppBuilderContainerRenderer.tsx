import DexAppBuilderCreate from "../DexAppBuilderCreate";
import DexAppBuilderDeployContainer from "../DexAppBuilderDeployContainer";
import ContainerProvider from "./ContainerProvider";
import DexAppBuilderDeployedContracts from "./DexAppBuilderDeployedContracts";
import DexAppBuilderForm from "./DexAppBuilderForm";
import DexAppBuilderManageForms from "./DexAppBuilderManageForms";
import DexAppBuilderFormEdit from "./DexAppBuilderFormEdit";

export const CONTAINERS: { [key: string]: React.ReactNode } = {
  "dexappbuilder.deploy.contract": <DexAppBuilderDeployContainer />,
  "dexappbuilder.manage.contract": <DexAppBuilderDeployedContracts />,
  "dexappbuilder.manage.contract.form": <DexAppBuilderManageForms />,
  "dexappbuilder.create.contract.form": <DexAppBuilderCreate />,
  'dexappbuilder.form': <DexAppBuilderForm />,
  'dexappbuilder.form.edit': <DexAppBuilderFormEdit />,
};

export interface DexAppBuilderContainerRendererProps {
  containerId: string;
  onActiveMenu: (activeMenu: string) => void;
}

export default function DexAppBuilderContainerRenderer({
  containerId,
  onActiveMenu,
}: DexAppBuilderContainerRendererProps) {
  return (
    <ContainerProvider containerId={containerId} onActiveMenu={onActiveMenu}>
      {(id) => CONTAINERS[id]}
    </ContainerProvider>
  );
}
