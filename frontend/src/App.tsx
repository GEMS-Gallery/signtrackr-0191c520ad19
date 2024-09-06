import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type SignatureRequest = {
  id: bigint;
  name: string;
  notes: string | null;
  link: string;
  createdAt: bigint;
  signed: boolean;
};

type FormData = {
  name: string;
  notes: string;
  link: string;
};

const App: React.FC = () => {
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const result = await backend.getSignatureRequests();
      setRequests(result);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await backend.addSignatureRequest(data.name, data.notes ? [data.notes] : [], data.link);
      if ('ok' in result) {
        await fetchRequests();
        reset();
      } else {
        console.error('Error adding request:', result.err);
      }
    } catch (error) {
      console.error('Error adding request:', error);
    }
    setLoading(false);
  };

  const handleSignatureStatus = async (id: bigint, signed: boolean) => {
    setLoading(true);
    try {
      const result = await backend.updateSignatureStatus(id, signed);
      if ('ok' in result) {
        await fetchRequests();
      } else {
        console.error('Error updating signature status:', result.err);
      }
    } catch (error) {
      console.error('Error updating signature status:', error);
    }
    setLoading(false);
  };

  const calculateDaysPending = (createdAt: bigint) => {
    const now = BigInt(Date.now()) * BigInt(1000000);
    const diff = now - createdAt;
    return Number(diff / BigInt(86400000000000));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', my: 4 }}>
        Signature Tracker
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="notes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          )}
        />
        <Controller
          name="link"
          control={control}
          defaultValue=""
          rules={{ required: 'Link is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Link"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Request'}
        </Button>
      </form>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Days Pending</TableCell>
              <TableCell>Signed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id.toString()}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.notes}</TableCell>
                <TableCell>
                  <a href={request.link} target="_blank" rel="noopener noreferrer">
                    {request.link}
                  </a>
                </TableCell>
                <TableCell>
                  {request.signed ? 'Signed' : calculateDaysPending(request.createdAt)}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={request.signed}
                    onChange={(e) => handleSignatureStatus(request.id, e.target.checked)}
                    disabled={loading}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
