"use client";
import Button from "@/components/CommonUI/Button";
import { getContractAddress } from "@/configs/contract";
import { getTxErrorMessage } from "@/utils/string";
import { posiedonHash } from "@/utils/voting/helpers";
import { hasZkId, storeZkId } from "@/utils/voting/storage";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import {
  Fragment,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useContractWrite } from "wagmi";
const { ZkIdentity } = require("@libsem/identity");

type ContextState = {
  open: (callback?: () => void) => void;
  isRegistered: boolean;
};

const CommitmentContext = createContext({} as ContextState);
const doNothing = () => {};

export const useCommitmentContext = () => useContext(CommitmentContext);

const CommitmentProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisteringCommitment, setIsRegisteringCommitment] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();
  const [identityTrapdoor, setIdentityTrapdoor] = useState<string>();
  const [identityNullifier, setIdentityNullifier] = useState<string>();
  const [serializedIdentity, setSerializedIdentity] = useState<string>();
  const [isRegistered, setIsRegistered] = useState(false);

  const callbackRef = useRef<() => void>();

  const { writeAsync, isLoading } = useContractWrite({
    mode: "recklesslyUnprepared",
    abi: ["function regsiterCommitment(uint256)"],
    functionName: "regsiterCommitment",
    address: getContractAddress(chainId, "voting"),
  });

  const generateIdentity = useCallback(async () => {
    setIsOpen(true);
    if (address == null || !chainId) {
      return;
    }
    const identity: typeof ZkIdentity = new ZkIdentity();
    const { identityNullifier, identityTrapdoor } = identity.getIdentity();
    setIdentityTrapdoor(identityTrapdoor.toString());
    setIdentityNullifier(identityNullifier.toString());
    setSerializedIdentity(identity.serializeIdentity());
  }, [address, chainId]);

  useEffect(() => {
    setIsRegistered(!!address && hasZkId(address, chainId));
  }, [address, chainId]);

  useEffect(() => {
    if (isOpen && !serializedIdentity) {
      generateIdentity();
    }
  }, [isOpen, serializedIdentity, generateIdentity]);

  const registerCommitment = useCallback(async () => {
    if (!address) {
      return;
    }
    if (!identityTrapdoor || !identityNullifier || !serializedIdentity) {
      return;
    }
    setIsRegisteringCommitment(true);
    const toastId = toast.loading("Registering commitment...", {
      autoClose: false,
    });

    try {
      const hash = await posiedonHash([BigInt(identityTrapdoor), BigInt(identityNullifier)]);
      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [hash],
      });
      await tx.wait();
      setIsOpen(false);
      storeZkId(serializedIdentity, address, chainId);
      toast.update(toastId, {
        render: "Commitment registered successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setIsRegistered(true);
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
    } catch (e) {
      console.error(e);
      toast.update(toastId, {
        render: getTxErrorMessage(e),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsRegisteringCommitment(false);
    }
  }, [address, chainId, identityNullifier, identityTrapdoor, serializedIdentity, writeAsync]);

  const open = useCallback((callback?: () => void) => {
    callbackRef.current = callback;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo<ContextState>(
    () => ({
      open,
      isRegistered,
    }),
    [open, isRegistered]
  );

  return (
    <CommitmentContext.Provider value={contextValue}>
      {children}
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={doNothing}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-xl py-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="px-8 pt-4 text-2xl font-semibold leading-6 text-gray-900"
                    >
                      Register your commitment
                    </Dialog.Title>
                    <div className="px-8 mt-6 space-y-8">
                      <div>
                        <label htmlFor="chainID" className="text-black font-semibold text-[15px]">
                          Chain ID
                        </label>
                        <input
                          type="text"
                          id="chainID"
                          value={chainId}
                          className="w-full bg-gray-100 text-black placeholder:text-[#808080] rounded-[4px] px-4 py-2 mt-2"
                          disabled
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="text-black font-semibold text-[15px]">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={address}
                          className="w-full bg-gray-100 text-black placeholder:text-[#808080] rounded-[4px] px-4 py-2 mt-2"
                          disabled
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="identityTrapdoor"
                          className="text-black font-semibold text-[15px]"
                        >
                          Identity Trapdoor
                        </label>
                        <input
                          type="text"
                          id="identityTrapdoor"
                          value={identityTrapdoor}
                          className="w-full bg-gray-100 text-black placeholder:text-[#808080] rounded-[4px] px-4 py-2 mt-2"
                          disabled
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="identityNullifier"
                          className="text-black font-semibold text-[15px]"
                        >
                          Identity Nullifier
                        </label>
                        <input
                          type="text"
                          id="identityNullifier"
                          value={identityNullifier}
                          className="w-full bg-gray-100 text-black placeholder:text-[#808080] rounded-[4px] px-4 py-2 mt-2"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="px-8">
                      <button className="flex items-center justify-center w-full gap-2 py-3 mt-4 bg-gray-200 rounded-lg focus:ring-0 focus:outline-none">
                        <Image
                          src="/assets/icons/download.svg"
                          width={24}
                          height={24}
                          quality={100}
                          alt=">"
                          className="inline-flex mr-2"
                        />
                        <span>Download Your Key</span>
                      </button>
                    </div>
                    <div className="flex justify-between px-8 pt-4 mt-4 border-t border-gray-300">
                      <Button
                        disabled={isRegisteringCommitment}
                        onClick={close}
                        className="!text-black !bg-gray-200 rounded-xl hover:!bg-gray-300"
                      >
                        Close
                      </Button>
                      <Button
                        isLoading={isRegisteringCommitment}
                        onClick={registerCommitment}
                        className="rounded-xl"
                      >
                        Register Commitment
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </CommitmentContext.Provider>
  );
};

export default CommitmentProvider;
