import {Network, NETWORK_IDS} from "@/types/network";

export const Addresses = ({network}: {
    network: Network
}) => {
    return (
    <div className="text-left text-sm w-full">
        <div>
          <div className="hidden lg:inline">AI contract: <a className="underline" href={`https://suiscan.com/object/${NETWORK_IDS[network].packageId}?network=${network}`}>{NETWORK_IDS[network].packageId}</a></div>
          <div className="inline lg:hidden">AI contract: <a className="underline" href={`https://suiscan.com/object/${NETWORK_IDS[network].packageId}?network=${network}`}>{NETWORK_IDS[network].packageId.slice(0, 10)}...</a>
          </div>
        </div>
        <div className="pt-4">
          <div className="hidden lg:inline">
            AI registry:&nbsp;
            <a className="underline" href={`https://suiscan.com/object/${NETWORK_IDS[network].registryObjectId}?network=${network}`}>{NETWORK_IDS[network].registryObjectId}</a>
          </div>
          <div className="inline lg:hidden">
            AI registry:&nbsp;
            <a className="underline" href={`https://suiscan.com/object/${NETWORK_IDS[network].registryObjectId}?network=${network}`}>{NETWORK_IDS[network].registryObjectId.slice(0, 10)}...</a>
          </div>
        </div>
      </div>
    );
  };
  
  export default Addresses;