import sys
import time

import libtorrent


def handle_torrent(magnet_link):
    session = libtorrent.session()
    session.listen_on(6881, 6881)

    params = {"save_path": "./torrents/"}

    handle = libtorrent.add_magnet_uri(session, magnet_link, params)
    handle.set_sequential_download(True)
    status = handle.status()

    print(f"Starting download of {handle.status().name}")
    while not status.is_seeding:
        status = handle.status()

        print(
            "\r%.2f%% complete (down: %.1f kB/s up: %.1f kB/s peers: %d) %s"
            % (
                status.progress * 100,
                status.download_rate / 1000,
                status.upload_rate / 1000,
                status.num_peers,
                status.state,
            ),
            end=" ",
        )

        sys.stdout.flush()
        time.sleep(1)

    print(f"{handle.status().name} complete")


if __name__ == "__main__":
    if len(sys.argv) == 1:
        raise (Exception("No magnet link provided"))
    with open(sys.argv[1]) as magnet_link:
        breakpoint()
        handle_torrent(magnet_link.read())
