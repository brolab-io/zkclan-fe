/* eslint-disable @next/next/no-img-element */
"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useContractWrite } from "wagmi";

const CreateClanPage = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [applicationStatus, setApplicationStatus] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const setApplicationStatusTrue = () => setApplicationStatus(true);
  const setApplicationStatusFalse = () => setApplicationStatus(false);

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    abi: ["function regsiterCommitment(uint256)"],
    functionName: "regsiterCommitment",
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
  });

  const handleCreateClan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    writeAsync({
      recklesslySetUnpreparedArgs: [1],
    });
  };
  const handleClickSelectFile = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      const _previewImage = URL.createObjectURL(file);
      setPreviewImage(_previewImage);
      return () => {
        URL.revokeObjectURL(_previewImage);
      };
    }
  }, [file]);

  return (
    <Container className="py-16 !max-w-[900px]">
      <form onSubmit={handleCreateClan} className="bg-[#0C121D] rounded-[16px] py-12 px-20">
        <h1 className="text-white text-[32px] font-bold">Start your Clan</h1>
        <div className="flex items-center w-full mt-6 gap-7">
          <div className="flex items-center justify-center flex-shrink-0 w-32 h-32 rounded-full bg-[#FFFFFF] bg-opacity-[3%]">
            {previewImage ? (
              <img src={previewImage} className="w-32 h-32 rounded-full" alt="Image" />
            ) : (
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_19_731)">
                  <path
                    d="M14.375 17.0729C12.0317 17.0729 10.1354 15.1767 10.1354 12.8333C10.1354 10.49 12.0317 8.59375 14.375 8.59375C16.7184 8.59375 18.6146 10.49 18.6146 12.8333C18.6146 15.1767 16.7184 17.0729 14.375 17.0729ZM14.375 10.9062C13.3113 10.9062 12.4479 11.7696 12.4479 12.8333C12.4479 13.8971 13.3113 14.7604 14.375 14.7604C15.4388 14.7604 16.3021 13.8971 16.3021 12.8333C16.3021 11.7696 15.4388 10.9062 14.375 10.9062Z"
                    fill="#808080"
                  />
                  <path
                    d="M23.625 35.5728H14.375C6.00373 35.5728 2.42706 31.9962 2.42706 23.6249V14.3749C2.42706 6.00367 6.00373 2.427 14.375 2.427H20.5416C21.1737 2.427 21.6979 2.95117 21.6979 3.58325C21.6979 4.21534 21.1737 4.7395 20.5416 4.7395H14.375C7.2679 4.7395 4.73956 7.26784 4.73956 14.3749V23.6249C4.73956 30.732 7.2679 33.2603 14.375 33.2603H23.625C30.7321 33.2603 33.2604 30.732 33.2604 23.6249V15.9166C33.2604 15.2845 33.7846 14.7603 34.4166 14.7603C35.0487 14.7603 35.5729 15.2845 35.5729 15.9166V23.6249C35.5729 31.9962 31.9962 35.5728 23.625 35.5728Z"
                    fill="#808080"
                  />
                  <path
                    d="M28.25 13.9897C27.6179 13.9897 27.0938 13.4655 27.0938 12.8334V3.5834C27.0938 3.1209 27.3712 2.68924 27.8029 2.51965C28.2346 2.35007 28.7279 2.44257 29.0671 2.76632L32.1504 5.84965C32.5975 6.29674 32.5975 7.03674 32.1504 7.48382C31.7033 7.9309 30.9633 7.9309 30.5162 7.48382L29.4062 6.37382V12.8334C29.4062 13.4655 28.8821 13.9897 28.25 13.9897Z"
                    fill="#808080"
                  />
                  <path
                    d="M25.1666 7.82289C24.8737 7.82289 24.5808 7.71497 24.3495 7.48372C23.9025 7.03664 23.9025 6.29664 24.3495 5.84955L27.4329 2.76622C27.88 2.31914 28.6199 2.31914 29.067 2.76622C29.5141 3.2133 29.5141 3.9533 29.067 4.40039L25.9837 7.48372C25.7524 7.71497 25.4595 7.82289 25.1666 7.82289Z"
                    fill="#808080"
                  />
                  <path
                    d="M4.61636 30.8708C4.24636 30.8708 3.87636 30.6858 3.66052 30.362C3.30594 29.8379 3.44469 29.1133 3.96886 28.7587L11.5693 23.6558C13.2343 22.5458 15.5314 22.6691 17.0422 23.9487L17.5509 24.3958C18.3218 25.0587 19.6322 25.0587 20.3876 24.3958L26.8009 18.892C28.4351 17.4891 31.0097 17.4891 32.6593 18.892L35.1722 21.0504C35.6501 21.4666 35.7118 22.1912 35.2955 22.6845C34.8793 23.1624 34.1393 23.2241 33.6614 22.8079L31.1484 20.6495C30.3776 19.9866 29.0826 19.9866 28.3118 20.6495L21.8984 26.1533C20.2643 27.5562 17.6897 27.5562 16.0401 26.1533L15.5314 25.7062C14.8222 25.1049 13.6505 25.0433 12.8643 25.5829L5.27927 30.6858C5.06344 30.8091 4.83219 30.8708 4.61636 30.8708Z"
                    fill="#808080"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_19_731">
                    <rect width="37" height="37" fill="white" transform="translate(0.5 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
          <div className="text-[#808080]">
            <button
              onClick={handleClickSelectFile}
              type="button"
              className="text-[15px] text-white px-6 py-2 border-white border rounded-md font-semibold"
            >
              Upload image
            </button>
            <p className="mt-4">Upload your Clan&apos;s avatar for better recognition.</p>
            <p>Formats: png, jpg, gif. Max size: 2 MB</p>
          </div>
          <input
            type="file"
            ref={inputFileRef}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-[26px]">
          <label htmlFor="name" className="text-white font-semibold text-[15px]">
            Clan name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a unique clan name here"
            className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            required
          />
        </div>
        <div className="mt-[26px]">
          <label htmlFor="email" className="text-white font-semibold text-[15px]">
            Clan email address *
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email for communication here"
            className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            required
          />
        </div>
        <div className="mt-[26px]">
          <label className="text-white font-semibold text-[15px]">Clan application status</label>
          <div className="flex w-full mt-4">
            <div
              className={clsx(
                "flex flex-1 rounded-l-2xl gap-3.5 items-center px-3.5 py-4 cursor-pointer transition-all",
                applicationStatus ? "bg-[#5C8AED]" : "bg-[#FFFFFF] bg-opacity-[3%] text-white"
              )}
              onClick={setApplicationStatusTrue}
            >
              <svg
                width="25"
                height="26"
                viewBox="0 0 25 26"
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.33 23.3H7.33002C2.92002 23.3 1.58002 21.96 1.58002 17.55V15.55C1.58002 11.14 2.92002 9.80005 7.33002 9.80005H17.33C21.74 9.80005 23.08 11.14 23.08 15.55V17.55C23.08 21.96 21.74 23.3 17.33 23.3ZM7.33002 11.3C3.75002 11.3 3.08002 11.98 3.08002 15.55V17.55C3.08002 21.12 3.75002 21.8 7.33002 21.8H17.33C20.91 21.8 21.58 21.12 21.58 17.55V15.55C21.58 11.98 20.91 11.3 17.33 11.3H7.33002Z"
                  fill="#040A16"
                />
                <path
                  d="M6.33002 11.3C5.92002 11.3 5.58002 10.96 5.58002 10.55V8.55005C5.58002 5.65005 6.28002 1.80005 12.33 1.80005C16.81 1.80005 19.08 3.73005 19.08 7.55005C19.08 7.96005 18.74 8.30005 18.33 8.30005C17.92 8.30005 17.58 7.96005 17.58 7.55005C17.58 5.57005 16.98 3.30005 12.33 3.30005C7.97002 3.30005 7.08002 5.40005 7.08002 8.55005V10.55C7.08002 10.96 6.74002 11.3 6.33002 11.3Z"
                  fill="#040A16"
                />
                <path
                  d="M12.33 19.8C10.54 19.8 9.08002 18.34 9.08002 16.55C9.08002 14.76 10.54 13.3 12.33 13.3C14.12 13.3 15.58 14.76 15.58 16.55C15.58 18.34 14.12 19.8 12.33 19.8ZM12.33 14.8C11.37 14.8 10.58 15.59 10.58 16.55C10.58 17.51 11.37 18.3 12.33 18.3C13.29 18.3 14.08 17.51 14.08 16.55C14.08 15.59 13.29 14.8 12.33 14.8Z"
                  fill="#040A16"
                />
              </svg>
              <div>
                <div className="font-semibold text-[12px]">Open</div>
                <p className="mt-[5px] text-[10px]">Anyone can apply to join the club</p>
              </div>
            </div>
            <div
              className={clsx(
                "flex flex-1 rounded-r-2xl gap-3.5 items-center px-3.5 py-4 cursor-pointer transition-all",
                !applicationStatus ? "bg-[#5C8AED]" : "bg-[#FFFFFF] bg-opacity-[3%] text-white"
              )}
              onClick={setApplicationStatusFalse}
            >
              <svg
                width="25"
                height="26"
                viewBox="0 0 25 26"
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.33 11.3C17.92 11.3 17.58 10.96 17.58 10.55V8.55005C17.58 5.40005 16.69 3.30005 12.33 3.30005C7.96996 3.30005 7.07996 5.40005 7.07996 8.55005V10.55C7.07996 10.96 6.73996 11.3 6.32996 11.3C5.91996 11.3 5.57996 10.96 5.57996 10.55V8.55005C5.57996 5.65005 6.27996 1.80005 12.33 1.80005C18.38 1.80005 19.08 5.65005 19.08 8.55005V10.55C19.08 10.96 18.74 11.3 18.33 11.3Z" />
                <path d="M12.33 19.8C10.54 19.8 9.07996 18.34 9.07996 16.55C9.07996 14.76 10.54 13.3 12.33 13.3C14.12 13.3 15.58 14.76 15.58 16.55C15.58 18.34 14.12 19.8 12.33 19.8ZM12.33 14.8C11.37 14.8 10.58 15.59 10.58 16.55C10.58 17.51 11.37 18.3 12.33 18.3C13.29 18.3 14.08 17.51 14.08 16.55C14.08 15.59 13.29 14.8 12.33 14.8Z" />
                <path d="M17.33 23.3H7.32996C2.91996 23.3 1.57996 21.96 1.57996 17.55V15.55C1.57996 11.14 2.91996 9.80005 7.32996 9.80005H17.33C21.74 9.80005 23.08 11.14 23.08 15.55V17.55C23.08 21.96 21.74 23.3 17.33 23.3ZM7.32996 11.3C3.74996 11.3 3.07996 11.98 3.07996 15.55V17.55C3.07996 21.12 3.74996 21.8 7.32996 21.8H17.33C20.91 21.8 21.58 21.12 21.58 17.55V15.55C21.58 11.98 20.91 11.3 17.33 11.3H7.32996Z" />
              </svg>

              <div>
                <div className="font-semibold text-[12px]">Closed</div>
                <p className="mt-[5px] text-[10px]">Founder needs to invite new member</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[26px]">
          <label htmlFor="description" className="text-white font-semibold text-[15px]">
            Clan description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What’s your clan all about and who is it for"
            className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            required
          />
        </div>
        <div className="flex items-center justify-between w-full mt-6">
          <div />
          <Button type="submit" className="rounded-md">
            Create Clan{" "}
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              className="inline-block"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_19_784)">
                <path
                  d="M11.6626 14.4449C11.5201 14.4449 11.3776 14.3924 11.2651 14.2799C11.0476 14.0624 11.0476 13.7024 11.2651 13.4849L15.4201 9.32992L11.2651 5.17492C11.0476 4.95742 11.0476 4.59742 11.2651 4.37992C11.4826 4.16242 11.8426 4.16242 12.0601 4.37992L16.6126 8.93242C16.8301 9.14992 16.8301 9.50992 16.6126 9.72742L12.0601 14.2799C11.9476 14.3924 11.8051 14.4449 11.6626 14.4449Z"
                  fill="white"
                />
                <path
                  d="M16.0876 9.89258H3.46509C3.15759 9.89258 2.90259 9.63758 2.90259 9.33008C2.90259 9.02258 3.15759 8.76758 3.46509 8.76758H16.0876C16.3951 8.76758 16.6501 9.02258 16.6501 9.33008C16.6501 9.63758 16.3951 9.89258 16.0876 9.89258Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_19_784">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(0.840088 0.330078)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default CreateClanPage;
