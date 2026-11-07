filecxx_wui.messages =
{
    "error":function(msg)
    {

    },
    "pong":function(msg)
    {

    },
    "heartbeat":function(msg)
    {

    },
    "invalid":function(msg)
    {

    },


    "configs":function(msg)
    {

    },
    "proxies":function(msg)
    {

    },
    "http_mirrors":function(msg)
    {

    },
    "site_rules":function(msg)
    {

    },
    "subscribes":function(msg)
    {

    },
    "catalogs":function(msg)
    {

    },
    "paths":function(msg)
    {

    },
    "tasks":function(msg)
    {

    },
    "status":function(msg)
    {

    },
    "statistics":function(msg)
    {

    },
    "trackers":function(msg)
    {

    },
    "nfs_hosts":function(msg)
    {

    },
    "remote_clients":function(msg)
    {

    },
    "service_users":function(msg)
    {

    },

    "config_update":function(msg)
    {

    },

    "path_add":function(msg)
    {

    },

    "service_user_add":function(msg)
    {

    },
    "service_user_edit":function(msg)
    {

    },
    "service_user_remove":function(msg)
    {

    },

    "proxy_add":function(msg)
    {

    },
    "proxy_update":function(msg)
    {

    },
    "proxy_remove":function(msg)
    {

    },
    "proxy_test":function(msg)
    {

    },
    "proxy_extractor":function(msg)
    {

    },

    "http_mirror_add":function(msg)
    {

    },
    "http_mirror_update":function(msg)
    {

    },
    "http_mirror_remove":function(msg)
    {

    },

    "site_rule_add":function(msg)
    {

    },
    "site_rule_update":function(msg)
    {

    },
    "site_rule_remove":function(msg)
    {

    },

    "subscribe_add":function(msg)
    {

    },
    "subscribe_update":function(msg)
    {

    },
    "subscribe_remove":function(msg)
    {

    },
    "subscribe_update_trackers":function(msg)
    {

    },

    "catalog_add":function(msg)
    {

    },
    "catalog_update":function(msg)
    {

    },
    "catalog_remove":function(msg)
    {

    },
    "catalog_merge":function(msg)
    {

    },

    "task_add":function(msg)
    {

    },
    "task_add_stream":function(msg)
    {

    },
    "task_add_file":function(msg)
    {

    },
    "task_pause":function(msg)
    {

    },
    "task_resume":function(msg)
    {

    },
    "task_remove":function(msg)
    {

    },
    "task_move":function(msg)
    {

    },
    "task_rename":function(msg)
    {

    },
    "task_redownload":function(msg)
    {

    },
    "task_refresh_address":function(msg)
    {

    },
    "task_edit":function(msg)
    {

    },
    "task_set_catalog":function(msg)
    {

    },
    "task_export_torrent":function(msg)
    {

    },
    "task_status":function(msg)
    {

    },
    "task_progress":function(msg)
    {

    },
    "task_files":function(msg)
    {

    },
    "task_details":function(msg)
    {

    },
    "task_config":function(msg)
    {

    },
    "task_files_enable":function(msg)
    {

    },
    "task_confirm":function(msg)
    {

    },
    "task_confirm_links":function(msg)
    {

    },

    "task_tracker_add":function(msg)
    {

    },
    "task_tracker_edit":function(msg)
    {

    },
    "task_tracker_remove":function(msg)
    {

    },
    "task_tracker_force_reannounce":function(msg)
    {

    },
    "task_web_seed_add":function(msg)
    {

    },
    "task_web_seed_edit":function(msg)
    {

    },
    "task_web_seed_remove":function(msg)
    {

    },
    "task_peer_add":function(msg)
    {

    },
    "task_peer_operation":function(msg)
    {

    },

    "magnet_to_torrent":function(msg)
    {

    },
    "magnet_to_torrent_status":function(msg)
    {

    },
    "torrent_to_magnet":function(msg)
    {

    },
    "torrent_query_server_add":function(msg)
    {

    },
    "torrent_create":function(msg)
    {

    },

    "torrent_ip_filter":function(msg)
    {

    },
    "torrent_ip_filter_add":function(msg)
    {

    },
    "torrent_ip_filter_remove":function(msg)
    {

    },
    "torrent_ip_filter_clear":function(msg)
    {

    },

    "update_check":function(msg)
    {

    },
    "update_upgrade":function(msg)
    {

    },
    "update_checked":function(msg)
    {

    },
    "update_status":function(msg)
    {

    },

    "fs_status":function(msg)
    {

    },
    "fs_group_add":function(msg)
    {

    },
    "fs_group_edit":function(msg)
    {

    },
    "fs_group_remove":function(msg)
    {

    },
    "fs_host_add":function(msg)
    {

    },
    "fs_host_edit":function(msg)
    {

    },
    "fs_host_remove":function(msg)
    {

    },

    "activation_expired":function(msg)
    {

    },
    "activation_reset":function(msg)
    {

    },
    "activation_query":function(msg)
    {

    },

    "remote_client_add":function(msg)
    {

    },
    "remote_client_edit":function(msg)
    {

    },
    "remote_client_remove":function(msg)
    {

    },

    "echo":function(msg)
    {

    },
    "ports":function(msg)
    {

    },

    "transcoding_media":function(msg)
    {

    },
    "av_merge":function(msg)
    {

    },

    "bind_service_port_error":function(msg)
    {

    },


    //------------------
    version:function(msg)
    {

    },
    running_state:function(msg)
    {
        console.log(msg)
    },


    //------------------
    boot:function()
    {
        filecxx_rpc.send("version");
        filecxx_rpc.send("running_state");
    }
}