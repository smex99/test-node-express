module.exports = {
    port: process.env.PORT || 5000,
    db: {
      mongodb: {
        url: process.env.DB_URL ||'mongodb://Ameziane:Farouha1982**@ds225703.mlab.com:25703/vue-express'
      },
      testmongodb: {
        url: process.env.DB_URL || 'mongodb://Ameziane:Farouha1982**@ds149754.mlab.com:49754/test_node_express'
      }
    },
    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret'
    },
    oauth: {
      google: {
        clientID:  process.env.CLIENT_ID || '248656784277-qrbl2pigifdsrbmg4kibjcgemtfq32dm.apps.googleusercontent.com',
        clientSecret: process.env.CLIENT_SECRET ||'NOIG4_11MyvBIjcajMK-dLX3'
      },
      facebook: {
        clientID: process.env.CLIENT_ID || '179726036282659',
        clientSecret: process.env.CLIENT_SECRET || 'ab1488bdd3036ca14c1b9687239966be'
      }
    }
  }