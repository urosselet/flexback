/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the development port                                                *
     ***************************************************************************/
    port: 1339,

    /***************************************************************************
     * The order of precedence for log levels from lowest to highest is:       *
     * silly, verbose, info, debug, warn, error                                *
     *                                                                         *
     * You may also set the level to "silent" to suppress all logs.            *
     ***************************************************************************/
    log: {
        level: 'info'
    },

    /***************************************************************************
     *                                                                          *
     * Which domains which are allowed CORS access? This can be a               *
     * comma-delimited list of hosts (beginning with http:// or https://) or    *
     * "*" to allow all domains CORS access.                                    *
     *                                                                          *
     ***************************************************************************/
    cors: {
        origin: '*'
    },

    /***************************************************************************
     * Asset url path                                                           *
     ***************************************************************************/
    asset_url: 'https://api.flexcrowd.org'

};