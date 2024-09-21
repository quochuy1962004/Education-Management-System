import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'services/firebase';
export const ECourseDocumentType = {
  FILE: 'FILE',
  VIDEO: 'VIDEO',
  NOTIFICATION: 'NOTIFICATION'
};
// Update course document in the database
export const updateCourseDocument = async (courseCode, documentData) => {
  const courseRef = doc(db, 'courses', courseCode);
  console.log(documentData);
  await updateDoc(courseRef, {
    courseDocuments: arrayUnion(documentData)
  });
};

// Remove course document from the database
export const removeCourseDocument = async (courseCode, documentId) => {
  const courseRef = doc(db, 'courses', courseCode);
  const courseDoc = await getDoc(courseRef);

  if (courseDoc.exists()) {
    const newCourseDocuments = courseDoc.data()?.courseDocuments?.filter((it) => it.id !== documentId);

    await updateDoc(courseRef, {
      courseDocuments: newCourseDocuments
    });
  }
};

export const updateDocument = async (courseCode, newDocument) => {
  const courseRef = doc(db, 'courses', courseCode);
  const courseDoc = await getDoc(courseRef);

  if (courseDoc.exists()) {
    const newCourseDocuments = courseDoc.data()?.courseDocuments?.map((it) => (it.id === newDocument.id ? newDocument : it));

    await updateDoc(courseRef, {
      courseDocuments: newCourseDocuments
    });
  }
};
