import { v4 as uuidv4 } from 'uuid';
import { useState, useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ECourseDocumentType, updateCourseDocument } from 'hooks/updateCourse';
import { Button } from '@mui/material';
import toast, {Toaster} from 'react-hot-toast';

const UploadButton = (course_code) => {
  const inputFileRef = useRef(null);
  const [courseSelected, setCourseSelected] = useState(course_code.course_code);
  const [isUploading, setIsUploading] = useState(false);
  const [documentUploadType, setDocumentUploadType] = useState(ECourseDocumentType.FILE);
  const onUploadFile = async (e) => {
    // Get the file from the upload event
    const file = e.target.files?.[0];

    if (!file || !courseSelected) return;

    try {
      setIsUploading(true);
      const splitFileName = file.name.split('.');

      const fileName = splitFileName[0] + '_' + uuidv4() + '.' + splitFileName[1];

      // Get a reference to Firebase storage
      const storage = getStorage();
      const storageRef = ref(storage, fileName);
      const res = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(res.ref);

      // Create new document data
      const documentData = {
        id: uuidv4(),
        name: file.name,
        content: url,
        type: documentUploadType
      };
      await updateCourseDocument(courseSelected, documentData);
      window.location.reload();
      toast.success('Upload document successfully');
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      inputFileRef.current && (inputFileRef.current.value = '');
    }
  };

  const onClickUploadBtn = async (course_code) => {
    // Save the selected course code to the state
    setCourseSelected(course_code.course_code);
    const type = prompt('Enter you document type (FILE, VIDEO, NOTIFICATION)');
    const typeFormatted = type?.toUpperCase();

    // Check if the entered document type is valid
    if (
      !typeFormatted ||
      ![ECourseDocumentType.FILE, ECourseDocumentType.NOTIFICATION, ECourseDocumentType.VIDEO].includes(typeFormatted)
    ) {
      console.log('loi roi');
      return;
    }

    setDocumentUploadType(typeFormatted);

    if (typeFormatted === ECourseDocumentType.NOTIFICATION) {
      const notificationContent = prompt('Enter your notification:');
      if (!notificationContent) return;

      setIsUploading(true);

      const documentData = {
        id: uuidv4(),
        content: notificationContent,
        type: typeFormatted
      };

      await updateCourseDocument(course_code.course_code, documentData);

      setIsUploading(false);
      toast.success('Upload document successfully');
    } else {
      if (isUploading || !inputFileRef.current) return;
      inputFileRef.current.accept = typeFormatted === ECourseDocumentType.FILE ? '.pdf' : '.mp4';
      inputFileRef.current.click();
    }
  };
  return (
    <> <div><Toaster position='top-right'/></div>
      <Button variant='contained' color = "secondary" onClick={() => onClickUploadBtn(course_code)}>{isUploading ? 'Uploading...' : 'Upload document'}</Button>
      <input type="file" name="" id="" hidden ref={inputFileRef} onChange={onUploadFile} />
    </>
  );
};
export default UploadButton;
