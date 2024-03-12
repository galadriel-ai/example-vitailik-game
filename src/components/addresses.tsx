export const Addresses = () => {
  return (
    <div className="text-left text-sm w-full pb-12 lg:pb-0">
      <div>
        <div className="hidden lg:inline">AI contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}</div>
        <div className="inline lg:hidden">AI
          contract: {(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "").slice(0, 10)}...
        </div>
      </div>
      <div className="pt-4">
        <div className="hidden lg:inline">
          Oracle contract:&nbsp;
          {process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS}
        </div>
        <div className="inline lg:hidden">
          Oracle contract:&nbsp;
          {(process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS || "").slice(0, 10)}...
        </div>
      </div>
    </div>
  );
};

export default Addresses;