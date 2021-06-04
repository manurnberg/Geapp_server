const SUFFIX = process.argv.indexOf('--env') === -1 ? '' :
      '-' + process.argv[process.argv.indexOf('--env')+1]

module.exports = {
    apps : [
      {
      name: 'geapp'+ SUFFIX,
      script: 'server/app.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'test',
        PORT:'3000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:'80'
      }
    }
  ],
  
    /* its not in use. i need to configure this. */
    deploy : {
      production : {
        user : 'node',
        host : '212.83.163.1',
        ref  : 'origin/master',
        repo : 'git@github.com:repo.git',
        path : '/var/www/production',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
      }
    }
  };
  