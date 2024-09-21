import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import { getCourse } from 'hooks/getCourse';
import { ECourseDocumentType, removeCourseDocument, updateDocument } from '../../hooks/updateCourse';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import getClassFromUser from 'hooks/getClassFromUser';
import UploadButton from 'ui-component/button/UploadButton';
import { Box, Card, Grid, Typography, Button, Chip, Stack, CardContent } from '@mui/material';
import toast, {Toaster} from 'react-hot-toast';
import StudentList from 'ui-component/dialog/ViewStudentList';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { IconBell, IconPdf } from '@tabler/icons-react';
import DeleteDocumentDialog from 'ui-component/dialog/DeleteDocumentDialog';
import DialogUpdateNotification from 'ui-component/dialog/UpdateNotificationDialog';


const CourseDetail = () => {
  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };

  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };
  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };

  const role = localStorage.getItem('role');
  const isTeacher = role === 'teacher';
  const videoRef = useRef();


  // Lấy course code từ URL parameters
  const params = useParams();
  const courseCode = params?.courseCode;

  // State variables để quản lý course data và document upload
  const [course, setCourse] = useState([]);
  const [documentSelected, setDocumentSelected] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [studentClass, setStudentClass] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedID, setDeletedID] = useState("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);


  const handldeDialogClose = () => setOpen(false);
  const handleDialogOpen = () => setOpen(true);

  const handleDeleteDialogOpen = (id) => {
    setOpenDeleteDialog(true);
    setDeletedID(id);
  }
  const handleDeleteDialogClose = () => {
    setDeletedID("");
    setOpenDeleteDialog(false);
  }

  const handleUpdateDialogOpen = () => {
    setOpenUpdateDialog(true);
  }

  const handleUpdateDialogClose = () => {
    setDeletedID("");
    setOpenUpdateDialog(false);
  }

  // Tham chiếu đến input file cho document upload
  const inputFileRef = useRef(null);
  // const userID localStorage.getItem('userId'));

  useEffect(() => {
    handleGetCourse();
    getClass();
  }, [courseCode]);
  // console.log(courseCode);


  const handleGetCourse = async () => {
    if (!courseCode) return;

    const course = await getCourse(courseCode);
    course && setCourse(course);
    console.log(course);
  };
  const getClass = async () => {
    if (!courseCode) return;
    const myClass = await getClassFromUser(courseCode, role);
    console.log('myClass', myClass);
    setStudentClass(myClass);
  };
  // Hàm mở course document trong trang mới
  const onOpenCourseDoc = (url) => {
    window.open(url, '_blank');
  };

  // Hàm xóa course document
  const onRemoveCourseDocument = async (documentId) => {
    if (!courseCode) return;
    await removeCourseDocument(courseCode, documentId);
    handleGetCourse();
    handleDeleteDialogClose();
  };

  const updateNotification = async (document, newNotification) => {
    // Cập nhật notification content
    
    await updateDocument(courseCode, {
      ...document,
      content: newNotification
    });
    handleGetCourse();
    handleUpdateDialogClose();
  }

  // Xử lí button click cho updating course document
  const onBtnUpdateClick = async (document) => {
    setDocumentSelected(document);
    if (!courseCode) return;

    // Nếu document là 1 notification, prompt nội dung mới
    if (document.type === ECourseDocumentType.NOTIFICATION) {
      handleUpdateDialogOpen()
      // await updateNotification(document)
      // setOpenUpdateDialog(false);
    } else {
      // Nếu document là 1 file, kích hoạt thao tác nhập file để cập nhật
      if (isUploading || !inputFileRef.current) return;
      inputFileRef.current.accept = document.type === ECourseDocumentType.FILE ? '.pdf' : '.mp4';
      inputFileRef.current.click();
    }
  };

  const onUploadFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);
      const splitFileName = file.name.split('.');

      const fileName = splitFileName[0] + '_' + uuidv4() + '.' + splitFileName[1];
      const storage = getStorage();
      const storageRef = ref(storage, fileName);
      const res = await uploadBytes(storageRef, file);

      // Lấy Url của tệp sau khi tải lên thành công
      const url = await getDownloadURL(res.ref);

      // Cập nhật document data với file URL mới
      const documentData = {
        ...documentSelected,
        name: file.name,
        content: url
      };

      // Cập nhật document trong database
      await updateDocument(course.courseCode, documentData);
      toast.success('Update document successfully');
      handleGetCourse();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      inputFileRef.current && (inputFileRef.current.value = '');
    }
  };

  const ContentBox = ({ bgcolor, title, isTeacher, it }) => (
    <>
    <div><Toaster position='top-right'/></div>
      <Card sx={{ mb: 3, mr:3, backgroundColor: bgcolor }}>
        <CardContent>
          <Grid container direction="column">
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                {it.type === ECourseDocumentType.FILE? <IconPdf stroke={1.5} size="1.3rem" /> : <IconBell stroke={1.5} size="1.3rem"/>}
                <Typography variant="subtitle1"  onClick={() => it.type === ECourseDocumentType.FILE? onOpenCourseDoc(it.content) : <></>}>{title}</Typography>
              </Stack>
            </Grid>
        {isTeacher && (
                  <Grid item xs={12}>
                    <Grid container justifyContent="flex-end" alignItems="center">
                        <Grid item>
                          <Chip label="Remove" sx={chipErrorSX} clickable onClick={()=> handleDeleteDialogOpen(it.id)} />
                        </Grid>
                        <Grid item>
                          <Chip label={isUploading && documentSelected?.id === it.id ? 'Updating...' : 'Edit'} sx={chipWarningSX} clickable onClick={() => onBtnUpdateClick(it)} />
                        </Grid>
                    </Grid>
              </Grid>
        )}
        </Grid>
        </CardContent>
      </Card>

    </>
  );
  const VideoBox = ({isTeacher, it}) => (
    <>
      <Card sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          py: 4.5,
          color: 'grey.800'
        }}
      >
          {it.name && (
                <Typography variant="subtitle1" color="inherit">
                  {it.name}
                </Typography>
              )}
              {!it.name && <Box sx={{ p: 1.15 }} />}
      </Box>

        <Grid item xs={12} sm={6} md={6} lg={6} sx={{objectFit:"cover", width: 720, height: 360}}>
          <video type="video/mp4" controls id="video" ref={videoRef} src={it.content} width={"100%"} height={"100%"}>
          <track kind="captions" />
          </video>
        </Grid>

      </Card>

        {isTeacher && (
          <Grid lg={6} container justifyContent="flex-end">
            <Grid item>
                <Chip label="Remove" sx={chipErrorSX} clickable onClick={()=> handleDeleteDialogOpen(it.id)} />
            </Grid>
            <Grid>
                <Chip label={isUploading && documentSelected?.id === it.id ? 'Updating...' : 'Edit'} sx={chipWarningSX} clickable onClick={() => onBtnUpdateClick(it)} />
            </Grid>
          </Grid>
        )}
    </>
  );

  return (
    studentClass?.status === "error"? <MainCard title={studentClass.message}/> : <MainCard title={`${courseCode} - ${course?.courseName}`}
      secondary={
        <Box display={'flex'} flexDirection={'row'} gap={1}>
          <Button variant='contained' onClick={handleDialogOpen}>List of Students</Button>
          {isTeacher?<UploadButton course_code={courseCode} /> : <></>}
        </Box>
        }>
      <input type="file" name="" id="" hidden ref={inputFileRef} onChange={onUploadFile} />
      <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <SubCard title="Notifications">
          <Grid container spacing={gridSpacing}>
              {course.courseDocuments?.filter((item) => item.type === ECourseDocumentType.NOTIFICATION)
              .map((it) =>
              <Grid item xs={12} sm={12} md={12} lg={6} key={`course-document-item-${it.id}`}>
                <ContentBox it={it} isTeacher={isTeacher} key={`course-document-item-${it.id}`} bgcolor="warning.light" title={it.content} dark />
                </Grid>
              )}
          </Grid>
        </SubCard>
      </Grid>

      <Grid item xs={12}>
        <SubCard title="Video">
          <Grid container spacing={gridSpacing}>
            {course.courseDocuments?.filter((item) => item.type === ECourseDocumentType.VIDEO)
              .map((it) =>
              <Grid item lg={12} key={`course-document-item-${it.id}`}>
                <VideoBox it={it} isTeacher={isTeacher} key={`course-document-item-${it.id}`} />
              </Grid>
              )}
          </Grid>
        </SubCard>
      </Grid>

      <Grid item xs={12}>
        <SubCard title="PDF">
          <Grid container spacing={gridSpacing}>
            {course.courseDocuments?.filter((item) => item.type === ECourseDocumentType.FILE)
              .map((it) =>
              <Grid item xs={12} sm={6} md={4} lg={4} key={`course-document-item-${it.id}`}>
                <ContentBox it={it} isTeacher={isTeacher} key={`course-document-item-${it.id}`} bgcolor={theme.palette.secondary.light} title={it.name} />
              </Grid>
              )}
          </Grid>
        </SubCard>
      </Grid>
      </Grid>
      <StudentList open={open} handleDialogClose={handldeDialogClose} studentClass={studentClass}/>
      <DeleteDocumentDialog open={openDeleteDialog} handldeDialogClose={handleDeleteDialogClose} deleteDocument={()=>onRemoveCourseDocument(deletedID)}/>
      <DialogUpdateNotification open={openUpdateDialog} handldeDialogClose={handleUpdateDialogClose} selectedNotification={documentSelected} updateNotification={updateNotification} />

    </MainCard>
  );
};
export default CourseDetail;
