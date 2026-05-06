# CourierLogix - AWS Amplify Deployment

This document provides step-by-step instructions to deploy the CourierLogix application to AWS Amplify.

## 🚀 Quick Deploy Steps

### Prerequisites
- AWS Account with Amplify access
- GitHub repository (already pushed to: https://github.com/princekumarjha83-oss/helloji)

### Step 1: Access AWS Amplify Console
1. Go to [AWS Management Console](https://aws.amazon.com/console/)
2. Navigate to **Amplify** service
3. Click **"Get started"** if it's your first time, or **"New app"** → **"Host web app"**

### Step 2: Connect Repository
1. Select **GitHub** as the repository provider
2. Click **"Connect branch"**
3. Authorize AWS to access your GitHub account
4. Select the **helloji** repository
5. Choose the **master** branch
6. Click **"Next"**

### Step 3: Configure Build Settings
The `amplify.yml` file in the root directory will automatically configure the build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Review and Deploy
1. **Build settings** should be auto-detected as:
   - **Framework**: React
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Start command**: `npm run dev` (for local development)

2. Click **"Next"**
3. Review the configuration
4. Click **"Save and deploy"**

### Step 5: Deployment Process
- Amplify will automatically:
  - Clone your repository
  - Install dependencies (`npm ci`)
  - Build the application (`npm run build`)
  - Deploy to CDN

The deployment typically takes 2-5 minutes.

### Step 6: Access Your Application
Once deployed, you'll get:
- **Production URL**: `https://your-app-name.amplifyapp.com`
- **Branch URLs**: For different branches
- **Custom domain**: Option to add your own domain

## 🔧 Advanced Configuration

### Environment Variables
Add these in Amplify Console → App settings → Environment variables:

```
VITE_API_URL=https://your-api-endpoint.com
VITE_MAP_API_KEY=your-map-api-key
```

### Custom Domains
1. Go to **Domain management** in Amplify Console
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration steps

### SSL Certificate
- Automatically provided for Amplify domains
- Free SSL certificates for custom domains

### Performance Optimizations
Your application includes:
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ Caching headers

## 📱 Features After Deployment

Once deployed, your application will have:
- 🌐 Global CDN distribution
- 🔒 HTTPS by default
- 📊 Real-time analytics
- 🔄 Auto-deployment on git push
- 📱 Mobile-responsive design
- 🌓 Dark mode support
- 🎨 Glassmorphism effects

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs in Amplify Console
   - Ensure all dependencies are in package.json
   - Verify amplify.yml configuration

2. **404 Errors**
   - Ensure `baseDirectory` is set to `dist`
   - Check if all files are included in artifacts

3. **API Errors**
   - Add environment variables for API endpoints
   - Check CORS configuration

### Build Logs Access
1. Go to Amplify Console
2. Select your app
3. Click on the deployment
4. View build logs for debugging

## 📈 Monitoring

### Amplify Console Features
- **Build monitoring**: Real-time build status
- **Analytics**: Page views, user sessions
- **Performance**: Core Web Vitals
- **Error tracking**: Automatic error monitoring

### Custom Analytics
Your application includes:
- User activity tracking
- Performance monitoring
- Error logging system

## 🔄 CI/CD Pipeline

Your deployment pipeline is now set up for:
- **Automatic deployments** on git push
- **Pull request previews**
- **Branch-based deployments**
- **Rollback capabilities**

## 🎯 Next Steps

1. **Test the deployed application**
2. **Set up custom domain** (optional)
3. **Configure monitoring**
4. **Add team members** to AWS Console
5. **Set up backup and recovery**

## 📞 Support

- **AWS Amplify Documentation**: https://docs.aws.amazon.com/amplify/
- **GitHub Issues**: For application-specific issues
- **AWS Support**: For infrastructure issues

---

**🎉 Congratulations!** Your CourierLogix application is now deployed on AWS Amplify with enterprise-grade infrastructure!
