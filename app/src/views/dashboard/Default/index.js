import { useEffect, useState, useContext } from 'react';

// material-ui
import { Grid, ImageList, ImageListItem } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { AuthContext } from 'context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'services/firebase';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const loadRole = async (currentUser) => {
  const docRef = doc(db, 'users', currentUser.uid);
  const docSnap = await getDoc(docRef);
  return await docSnap.data()?.role;
};

const Dashboard = () => {
  const [role, setRole] = useState(null);

  const currentUser = useContext(AuthContext);
  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        const roleData = await loadRole(currentUser);
        if (roleData) {
          setRole(roleData);
          localStorage.setItem('role', roleData);
        }
      }
    };
    fetchRole();
  }, [currentUser]);

  console.log(role);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title={`Hellooooo ${role}`}>
          <ImageList sx={{ height: 428 }} variant="quilted" cols={8} rowHeight={104}>
            <ImageListItem cols={4} rows={4}>
              <img src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66" alt={''} loading="lazy" style={{ borderRadius: 8 }} />
            </ImageListItem>
            <ImageListItem cols={2} rows={2}>
              <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac" alt={''} loading="lazy" style={{ borderRadius: 8 }} />
            </ImageListItem>
            <ImageListItem cols={2} rows={4}>
              <img src="https://images.unsplash.com/photo-1549675584-91f19337af3d" alt={''} loading="lazy" style={{ borderRadius: 8 }} />
            </ImageListItem>
            <ImageListItem cols={2} rows={2}>
              <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468" alt={''} loading="lazy" style={{ borderRadius: 8 }} />
            </ImageListItem>
          </ImageList>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
