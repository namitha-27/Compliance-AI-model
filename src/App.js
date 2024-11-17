import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [models, setModels] = useState([]);
  const [complianceReport, setComplianceReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEthicalGuidelines, setOpenEthicalGuidelines] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false); // State for Feedback dialog
  const [selectedModel, setSelectedModel] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  
  // Sidebar state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Feedback state
  const [feedback, setFeedback] = useState("");

  // Fetch models data from JSON server
  useEffect(() => {
    fetch("http://localhost:5000/models")
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => setErrorMessage("Error loading models"));
  }, []);

  // Fetch compliance report for a model
  const evaluateCompliance = (modelId) => {
    setLoadingReport(true);

    fetch(`http://localhost:5000/compliance-reports?modelId=${modelId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const report = data[0];
          setComplianceReport(report);
          const model = models.find((model) => model.id === modelId);
          setSelectedModel({ ...model, compliance_report: report });
          setOpenDialog(true);
        } else {
          setErrorMessage("Compliance report not found.");
        }
        setLoadingReport(false);
      })
      .catch((error) => {
        setErrorMessage("Error loading compliance report.");
        setLoadingReport(false);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setComplianceReport(null);
    setErrorMessage(""); // Clear any error messages when closing
  };

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  // Toggle sidebar drawer
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

   // Handle navigation item click
   const handleNavItemClick = (text) => {
     if (text === 'Ethical Guidelines') {
       setOpenEthicalGuidelines(true); // Open ethical guidelines dialog
     } else if (text === 'Feedback') {
       setOpenFeedbackDialog(true); // Open feedback dialog
     } else {
       console.log(`${text} clicked`); // Replace with actual navigation logic
     }
     setDrawerOpen(false); // Close drawer on item click
   };

   // Close Ethical Guidelines dialog
   const handleCloseEthicalGuidelines = () => {
     setOpenEthicalGuidelines(false);
   };

   // Close Feedback dialog and reset feedback state
   const handleCloseFeedbackDialog = () => {
     setOpenFeedbackDialog(false);
     setFeedback(""); // Reset feedback input
   };

   // Submit feedback function (you can customize this to send feedback to a server)
   const handleSubmitFeedback = () => {
     console.log("User Feedback:", feedback); // Replace with actual submission logic
     alert("Thank you for your feedback!"); // Simple confirmation alert
     handleCloseFeedbackDialog(); // Close dialog after submission
   };

   return (
     <div>
       {/* Header */}
       <AppBar position="static">
         <Toolbar>
           <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
             <MenuIcon />
           </IconButton>
           <Typography variant="h6">Compliance Assessment System</Typography>
         </Toolbar>
       </AppBar>

       {/* Sidebar */}
       <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
         <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
           <List>
             {['Home', 'Models', 'Reports', 'Settings', 'Ethical Guidelines', 'Feedback'].map((text, index) => (
               <ListItem button key={text} onClick={() => handleNavItemClick(text)}>
                 <ListItemText primary={text} />
               </ListItem>
             ))}
           </List>
         </Box>
       </Drawer>

       {/* Main Content */}
       <Container maxWidth="lg" sx={{ padding: '20px', backgroundColor: "#f4f6f8", marginTop: '16px' }}>
         <Typography variant="h5" align="center" paragraph>
           AI Model Compliance Overview
         </Typography>

         <Grid container spacing={4} justifyContent="center">
           {models.length === 0 ? (
             <Grid item xs={12}>
               <Paper elevation={3} sx={{ padding: '20px' }}>
                 <Typography variant="h6" align="center" color="textSecondary">
                   No models available at the moment.
                 </Typography>
               </Paper>
             </Grid>
           ) : (
             models.map((model) => (
               <Grid item xs={12} sm={6} md={4} key={model.id}>
                 <Card
                   sx={{
                     transition: "transform 0.3s ease-in-out",
                     borderRadius: "16px",
                     boxShadow: (theme) => theme.shadows[3],
                     "&:hover": {
                       transform: "scale(1.05)",
                       boxShadow: (theme) => theme.shadows[5],
                       backgroundColor: "#eaeff1",
                     },
                   }}
                 >
                   <CardContent sx={{ textAlign: "center" }}>
                     <Typography variant="h6" fontWeight="bold">{model.model_name}</Typography>
                     <Typography variant="body2" color="textSecondary">
                       {model.compliance_status}
                     </Typography>
                   </CardContent>
                   <CardActions>
                     <Button
                       variant="contained"
                       size="small"
                       sx={{
                         backgroundColor: "primary.main",
                         color: "#fff",
                         "&:hover": {
                           backgroundColor: "primary.dark",
                         },
                       }}
                       onClick={() => evaluateCompliance(model.id)}
                     >
                       Check Compliance
                     </Button>
                   </CardActions>
                 </Card>
               </Grid>
             ))
           )}
         </Grid>

         {/* Dialog for Compliance Report */}
         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
           <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', backgroundColor: '#f5f5f5' }}>
             Compliance Report for {selectedModel?.model_name}
           </DialogTitle>
           <DialogContent sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
             <Typography variant="h6" sx={{ marginBottom: 1 }}>Compliance Status</Typography>
             <Box sx={{ marginBottom: 2 }}>
               <Typography variant="body1">
                 <strong>Status:</strong> {selectedModel?.compliance_report?.compliance_status || "Not evaluated yet"}
               </Typography>
               <Typography variant="body1">
                 <strong>Data Usage:</strong> {selectedModel?.compliance_report?.data_usage || "Not evaluated yet"}
               </Typography>
               <Typography variant="body1">
                 <strong>Discrimination Check:</strong> {selectedModel?.compliance_report?.discrimination_check || "Not evaluated yet"}
               </Typography>
               <Typography variant="body1">
                 <strong>Proportionality Check:</strong> {selectedModel?.compliance_report?.proportionality_check || "Not evaluated yet"}
               </Typography>
             </Box>

             <Divider sx={{ marginY: 2 }} />

             <Typography variant="h6">Evaluation Criteria</Typography>
             <Box sx={{ marginBottom: 2, display: 'flex', flexWrap: 'wrap' }}>
               {(selectedModel?.compliance_report?.evaluation_criteria || []).map((criteria, index) => (
                 <Button key={index} variant="outlined" size="small" color="secondary" sx={{ marginRight: 1, marginBottom: 1 }}>
                   {criteria}
                 </Button>
               ))}
             </Box>

             <Divider sx={{ marginY: 2 }} />

             <Typography variant="h6" sx={{ marginTop: 2 }}>Compliance Report</Typography>
             <Typography variant="body1">
               {loadingReport ? (
                 <Box display="flex" alignItems="center">
                   <CircularProgress size={24} sx={{ marginRight: 1 }} />
                   Loading report...
                 </Box>
               ) : (
                 complianceReport?.compliance_status || "No report available"
               )}
             </Typography>
           </DialogContent>

           {/* Action Buttons in Dialog */}
           <DialogActions sx={{ justifyContent: 'space-between', padding: '10px' }}>
             {/* Uncomment if you have additional actions */}
             {/* 
             <Button onClick={handleDownloadReport} color="primary">Download Report</Button> 
             */}
             
             <Button onClick={handleCloseDialog} color="primary" variant="contained" sx={{
               '&:hover': {
                 backgroundColor: 'primary.dark',
               },
             }}>
               Close
             </Button>
           </DialogActions>
         </Dialog>

         {/* Ethical Guidelines Dialog */}
         <Dialog open={openEthicalGuidelines} onClose={handleCloseEthicalGuidelines}>
           <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#ffffff', fontWeight: 'bold' }}>
             Ethical Guidelines for AI Use
           </DialogTitle>
           <DialogContent dividers sx={{ backgroundColor: '#f0f4f8', color: '#333' }}>
             <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
               Our commitment to ethical AI includes principles of fairness, accountability, and transparency. We strive to ensure that AI systems are designed and operated in a manner that respects human rights and promotes social good.
             </Typography>

             {/* Additional guidelines can be added here */}
             <Divider sx={{ marginY: 2 }} />
             
             <Typography variant="h6" sx={{ color: '#1976d2' }}>Key Principles:</Typography>
             <ul style={{ paddingLeft: '20px', fontSize: '1rem' }}>
               <li><strong>Fairness:</strong> Ensure that AI systems do not discriminate against individuals or groups.</li>
               <li><strong>Accountability:</strong> Establish clear accountability for AI system outcomes.</li>
               <li><strong>Transparency:</strong> Provide clear information about how AI systems operate and make decisions.</li>
               <li><strong>Privacy:</strong> Protect individuals’ data and privacy rights.</li>
               {/* Add more principles as needed */}
             </ul>

           </DialogContent>

           {/* Enclosing the Close button in a styled Box */}
           <DialogActions sx={{ paddingX: '20px', paddingBottom: '10px' }}>
             <Box display='flex' justifyContent='flex-end' width='100%'>
               <Button 
                 onClick={handleCloseEthicalGuidelines} 
                 color="primary" 
                 variant="contained" 
                 sx={{
                   backgroundColor: '#1976d2',
                   color: '#ffffff',
                   '&:hover': {
                     backgroundColor: '#115293',
                   },
                   borderRadius: '20px',
                   paddingX: '20px',
                 }}
               >
                 Close
               </Button>
             </Box>
           </DialogActions>
         </Dialog>

         {/* Feedback Dialog */}
         <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)}>
           <DialogTitle>Submit Your Feedback</DialogTitle>
           <DialogContent dividers sx={{ minWidth: '400px' }}>
              {/* Feedback form */}
              <Typography variant="body1">We value your feedback! Please let us know your thoughts about our compliance assessments or any perceived biases.</Typography>
              {/* Textarea for user feedback */}
              <textarea 
                rows={4}
                style={{
                  width:'100%',
                  borderRadius:'4px',
                  border:'1px solid #ccc',
                  padding:'10px',
                  resize:'none'
                }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </DialogContent>

            {/* Action Buttons in Feedback Dialog */}
            <DialogActions sx={{ justifyContent:'space-between', paddingX:'20px' }}>
              {/* Submit Button */}
              <Button 
                onClick={handleSubmitFeedback}
                color='primary'
                variant='contained'
                disabled={!feedback.trim()} // Disable if feedback is empty
              >
                Submit Feedback
              </Button>

              {/* Close Button */}
              <Button onClick={() => setOpenFeedbackDialog(false)} color='secondary'>
                Cancel
              </Button>

            </DialogActions>

         </Dialog>

         {/* Snackbar for error messages */}
         <Snackbar open={Boolean(errorMessage)} autoHideDuration={6000} onClose={handleCloseSnackbar} message={errorMessage} sx={{
           backgroundColor: "error.main",
           borderRadius:'8px',
           padding:'10px',
         }} />
       </Container>
     </div >
   );
}

export default App;