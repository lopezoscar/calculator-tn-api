
#!/bin/bash
serverless deploy --stage production --param='corsWebOrigin=https://calculator-tn-webapp.vercel.app' --param='jwtKey=mV+VF4lH8/Z7eekRDFzYsxY4JYFZZZ7DEba2e2ZHLKg=' --param='randomOrgApiKey=35909380-94de-4853-a596-a4ec481e0b74' --param='dbConn=mongodb+srv://calculator-api:vsCUeL4WjX52Zfoc@mern-cluster.vdkcc.mongodb.net/?retryWrites=true&w=majority'