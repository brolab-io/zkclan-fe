"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Button from "./Button";

const WrongNetworkModal = () => {
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const isOpen = !!chain?.unsupported;
  const doNothing = () => {};
  return (
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
                <Dialog.Panel className="w-full max-w-md px-8 py-10 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                    Wrong Network
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-base text-gray-500">
                      You have connected to an unsupported network. Please switch to a supported
                      network.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 mt-6">
                    {(chains || []).map((chain) => (
                      <Button
                        type="button"
                        key={chain.id}
                        className="w-full py-2 rounded-md"
                        onClick={() => {
                          switchNetwork?.(chain.id);
                        }}
                      >
                        Switch to {chain.name}
                      </Button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default WrongNetworkModal;
