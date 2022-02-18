// Utility to manipuate a chain spec
//
// Can be useful after a "hard-spoon" of a live blockchain to spawn a new chain for testing.
// Partically forked from fork-off-substrate (https://raw.githubusercontent.com/maxsam4/fork-off-substrate)
// refer to https://github.com/Phala-Network/phala-blockchain/blob/master/scripts/js/src/bin/chainSpecUtils.js

// Replace validators by Alice

const fs = require('fs');
const { program } = require('commander');
const { xxhashAsHex } = require('@polkadot/util-crypto');

function loadJson(path) {
    const data = fs.readFileSync(path, {'encoding': 'utf-8'});
    return JSON.parse(data);
}

function writeJson(path, obj) {
    const data = JSON.stringify(obj, undefined, 2);
    fs.writeFileSync(path, data, {encoding: 'utf-8'});
}

program
    .option(
        '--remove-storage-version <pallets>',
        'Remove the storage version of the specific pallet to trigger storage migration, separated by commas.'
    )
    .argument('<orig-spec>', 'The original chain spec to modify.')
    .action(main)
    .parse(process.argv);

function main(origSpecPath) {
    const opts = program.opts();
    const targetSpec = loadJson(origSpecPath);

    // Session.keyOwner: 0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa1950
    // Session.nextKeys: 0xcec5070d609dd3497f72bde07fc96ba04c014e6bf8b8c2c011e7290b85696bb3
    const remove_prefix = [
        '0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa1950',
        '0xcec5070d609dd3497f72bde07fc96ba04c014e6bf8b8c2c011e7290b85696bb3'
    ]
    Object.entries(targetSpec.genesis.raw.top)
        .filter(([k, _v]) =>
            !remove_prefix.some(prefix => k.startsWith(prefix))
        )

    // replace Babe.authorities by Alice
    targetSpec.genesis.raw.top["0x1cb6f36e027abb2091cfb5110ab5087f5e0621c4869aa60c02be9adcc98a0d1d"]
        = "0x04d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0100000000000000";

    // replace GrandpaFinality.authorities by Alice
    targetSpec.genesis.raw.top["0x3A6772616E6470615F617574686F726974696573"]
        = "0x010488dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee0100000000000000";

    // replace ImOnline.keys by Alice
    targetSpec.genesis.raw.top["0x2b06af9719ac64d755623cda8ddd9b949f99a2ce711f3a31b2fc05604c93f179"]
        = "0x04d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";

    // replace AuthorityDiscovery.keys by Alice
    targetSpec.genesis.raw.top["0x2099d7f109d6e535fb000bba623fd4409f99a2ce711f3a31b2fc05604c93f179"]
        = "0x04d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";

    // replace Session.keyOwner
    // Babe, 1700946274 = 0x65626162 = ebab => babe
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa195066b8d48da86b869b6261626580d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"]
        = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
    // AuthorityDiscovery, 1768191329 = 0x69647561 = idua => audi
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa1950c9b0c13125732d276175646980d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"]
        = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
    // ImOnline, 1852796265 = 0x6e6f6d69 = nomi => imon
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa1950ed43a85541921049696d6f6e80d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"]
        = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
    // GrandpaFinality, 1851880039 = 0x6e617267 = narg => gran
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba0726380404683fc89e8233450c8aa1950f5537bdb2a1f626b6772616e8088dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee"]
        = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";

    // replace Session.nextKeys
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba04c014e6bf8b8c2c011e7290b85696bb3518366b5b1bc7c99d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"]
        = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0eed43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27dd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";

    // replace Session.queuedKeys
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba0e0cdd062e6eaf24295ad4ccfc41d4609"]
        = "0x04d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27dd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0eed43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27dd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
    // replace Session.validators
    targetSpec.genesis.raw.top["0xcec5070d609dd3497f72bde07fc96ba088dcde934c658227ee1dfafcd6e16903"]
        = "0x04d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"

    // Remove <Pallet>/:__STORAGE_VERSION__: to ensure the storage migration can be triggered
    if (opts.removeStorageVersion) {
        const STORAGE_VERSION_POSTFIX = xxhashAsHex(':__STORAGE_VERSION__:').substring(2);
        const prefixes = opts.removeStorageVersion
            .split(',')
            .map(p => xxhashAsHex(p, 128) + STORAGE_VERSION_POSTFIX);
        Object.keys(targetSpec.genesis.raw.top)
            .filter(k => prefixes.some(prefix => k.startsWith(prefix)))
            .forEach(k => delete targetSpec.genesis.raw.top[k]);
    }

    // Delete System.LastRuntimeUpgrade to ensure that the on_runtime_upgrade event is triggered
    delete targetSpec.genesis.raw.top['0x26aa394eea5630e07c48ae0c9558cef7f9cce9c888469bb1a0dceaa129672ef8'];

    // Modify chain name, id, chainType
    targetSpec.name = "ChainX-Replace";
    targetSpec.id = "chainx";
    targetSpec.chainType = "Development"

    // Set sudo key to //Alice
    targetSpec.genesis.raw.top['0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b'] = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d';

    // To prevent the validator set from changing mid-test, set XStaking.ForceEra to ForceNone ('0x02')
    const STAKING_FORCE_ERA = '0xa2162bba46c28c6fa06a97bac4ad9efdf7dad0317324aecae8744b87fc95f2f3';
    targetSpec.genesis.raw.top[STAKING_FORCE_ERA] = '0x02';

    //console.log(JSON.stringify(targetSpec, null, 2));

    writeJson(origSpecPath, targetSpec);

    console.log("replace ok")
}
