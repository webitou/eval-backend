# eval-backend
Projet de Gestion des évaluations des formations

## Routes
/***********************  
*******  ROUTES  *******  
************************/  
/api/v1  

/****************************  
*******  AUTH ROUTES  *******  
*****************************/  
POST/ auth/signup  
POST/ auth/signin  

/****************************  
*******  EVAL ROUTES  *******  
*****************************/  
// VIEW EVALS - GET/ eval/  
// GET ID - GET/ eval/:EvalId  
// ADD EVAL - POST/ eval/  
// UPDATE EVAL - POST/ eval/:EvalId  
// DELETE EVAL - DELETE/ eval/:EvalId  

/***************************************  
*******  MANAGE FORMATION ROUTE  *******  
****************************************/  
// VIEW FORMS - GET/ mgm-formation/  
// GET ID - GET/ mgm-formation/:FormId  
// ADD FORM - POST/ mgm-formation/  
// UPDATE FORM - POST/ mgm-formation/:FormId  
// DELETE FORM - DELETE/ mgm-formation/:FormId  

/**************************************  
*******  USER FORMATION ROUTES  *******  
***************************************/  
// ADD FORMATION - POST/ users/:UserId/formations  
// UPDATE FORM - PUT/ users/:UserId/formations/:FormId  
// DELETE FORM - PULL/ users/:UserId/formations/:FormId  

/*********************************  
*******  SEARCH FORMATION  *******  
**********************************/  
// SEARCH FORMS - GET/ formation?q=