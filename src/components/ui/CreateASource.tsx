// "use client";
// import React, { useState, useCallback, useRef } from "react";
// import { ArrowRight, Plus } from "lucide-react";
// import { ruda, merriweather } from "@/app/fonts";
// import { Input } from "./input";
// import { Button } from "./button";
// import Faq from "./Faq";
// import Source from "./Source";
// import { toast } from "sonner";
// import {
//   getCurrentUserID,
//   getSources,
//   getSourceFromDatabaseWhereSourceIdIs,
//   getFilesFromDatabaseFromSourceId,
//   ISource,
//   pushSourceToDatabase,
//   addSourceToAUsersSources,
//   IFile,
//   addFileToDatabase,
//   getFilesByFileIDs,
// } from "@/lib/actions/actions";
// import UploadFile from "./UploadFile";
// import { Textarea } from "./textarea";

// type Props = {
//   setSources: Function;
// };
// let createdSourcesCount = 0;
// const CreateASource = (props: Props) => {
//   const [sourceName, setSourceName] = useState("");
//   const [filesUploaded, setFilesUploaded] = useState<string[]>([]);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);
//   const userID = getCurrentUserID();
//   const sourceID = Math.random().toString();
//   const [theNewSourceTheyreUploading, setTheNewSourceTheyreUploading] =
//     useState({
//       id: sourceID,
//       userID: getCurrentUserID(),
//       subject: sourceName,
//       lastUsed: "Just now",
//       files: filesUploaded,
//     });
//   //create a new source in the db
//   addSourceToAUsersSources(userID, theNewSourceTheyreUploading);
//   //retrieve its ID
//   function addFileToTheNewSource(file: IFile) {
//     filesUploaded.push(file.id);
//     setFilesUploaded(filesUploaded);
//     setTheNewSourceTheyreUploading(theNewSourceTheyreUploading);
//   }
//   async function handleDone() {
//     setLoading(true);
//     if (!sourceName || !theNewSourceTheyreUploading.files.length) {
//       inputRef.current?.focus();
//       toast.error("Please enter a topic name and upload at least one file", {
//         className: "bg-red-500 text-white" + ruda.className,
//       });
//     } else {
//       toast.success(`Source '${sourceName}' created!`);

//       await pushSourceToDatabase(theNewSourceTheyreUploading);
//       props.setSources(getSourceFromDatabaseWhereSourceIdIs(userID));
//       setLoading(false);
//     }
//   }
//   return (
//     <>
//       <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
//         New Source
//       </h2>
//       <div className="flex flex-col gap-2">
//         <>
//           <div className="flex gap-2">
//             <Input
//               placeholder="Topic name (e.g. Electromagnetism)"
//               className={`${ruda.className}`}
//               onChange={(e) => setSourceName(e.target.value)}
//               ref={inputRef}
//             />

//             <Button
//               variant="primary"
//               tooltip="Done"
//               className={`bg-indigo-600 hover:bg-indigo-500 ${ruda.className}`}
//               onClick={handleDone}
//               loading={loading}
//             >
//               <ArrowRight className="h-8 w-8 stroke-2" color="#FFFFFF" />
//             </Button>
//           </div>
//           {theNewSourceTheyreUploading.files.length > 0 || sourceName !== "" ? (
//             <>
//               <Source
//                 index={createdSourcesCount++}
//                 source={theNewSourceTheyreUploading}
//                 files={getFilesByFileIDs(theNewSourceTheyreUploading.files)}
//                 appearanceMods={{
//                   _expandable: false,
//                   _expanded: true,
//                   _selectable: false,
//                 }}
//               />
//               <Textarea onChange={(e) => setSourceName(e.target.value)} />
//             </>
//           ) : (
//             <></>
//           )}
//           <article className={`${ruda.className}`}>
//             <h3>
//               The knowledge you'll gain is the content you upload - add
//               trustworthy sources! Supported formats include:
//             </h3>
//             <ul>
//               <li>• Lectures, YouTube videos, any other videos</li>
//               <li>• Any websites</li>
//             </ul>
//           </article>
//           <Faq />
//         </>
//       </div>
//     </>
//   );
// };

// export default CreateASource;
