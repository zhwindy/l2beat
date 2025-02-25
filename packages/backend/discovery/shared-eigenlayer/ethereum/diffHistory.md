Generated with discovered.json: 0x3b1b9bcb0deb6d53a25649a50d49c8a182699011

# Diff at Wed, 22 May 2024 14:05:14 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19840826
- current block number: 19925898

## Description

EigenPod implementation change:
      - Changed verification that the withdrawal credentials of validator(s) owned by the podOwner are pointed to the eigenPod contract.
            - Removed check that the provided timestamp of stateRoot being proven is after the `mostRecentWithdrawalTimestamp` (the latest timestamp at which the pod owner withdrew the balance of the pod).
            - After the M2 upgrade, `mostRecentWithdrawalTimestamp` will be 0 for any pods deployed. If this is non-zero, now the SC checks that the proof timestamp is from the epoch AFTER `activateRestaking` was called.

## Watched changes

```diff
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073) {
    +++ description: None
      values.implementation:
-        "0x8bA40dA60f0827d027F029aCEE62609F0527a255"
+        "0x28144C53bA98B4e909Df5bC7cA33eAf0404cFfcc"
    }
```

```diff
-   Status: DELETED
    contract EigenPod (0x8bA40dA60f0827d027F029aCEE62609F0527a255)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (0x28144C53bA98B4e909Df5bC7cA33eAf0404cFfcc)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/{.flat@19840826 => .flat}/EigenPod.sol | 21 ++++++++++++++++++---
 1 file changed, 18 insertions(+), 3 deletions(-)
```

Generated with discovered.json: 0x6189cb1db1c4577bb39dda1ac4b6ae7b87d6dcbe

# Diff at Tue, 30 Apr 2024 08:41:32 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@cc661a15d5c5c1361b3f5a3995e633888dd4f901 block: 19732379
- current block number: 19766998

## Description

This update registers the `bEIGEN-Strategy` in the `StrategyManager` and connects it to the bEIGEN and EIGEN tokens.
[EIGEN-Paper](https://github.com/Layr-Labs/whitepaper/blob/master/EIGEN_Token_Whitepaper.pdf)

### EIGEN and bEIGEN tokens

Eigenlayer chose a two-token design for its native token. While bEIGEN can be forked through a form of social consensus (called intersubjective forking in the paper), EIGEN is fork-unaware and will be convertible to the fork of bEIGEN that is supported by the governance of the EIGEN contract. Holding EIGEN delegates your fork-choice to the governance of this wrapper token. (EIGEN smart-contract)
Forking bEIGEN will comprise deploying a new bEIGEN that other contracts including the EIGEN wrapper token will have to be re-pointed to. The process will also include a challenge process and a ForkDistributor contract which is not discovered here but described in the paper.

### EIGEN governance

Each of bEIGEN and EIGEN contracts has a ProxyAdmin with a `TimelockController` as governance. In the `TimelockController`s, admins (=`EigenLayerProxiedMultisig`), proposers, cancellers and executors (=`EigenlayerTokenMultisig`) are defined. (see discovery)

### bEIGEN-Strategy

This is an extended `BaseStrategy` smart contract that will be used for staking bEIGEN. (It also allows EIGEN but will unwrap it for you on deposit)

## Watched changes

```diff
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
    +++ description: The entry- and exit-point for funds into and out of EigenLayer, manages strategies.
      values.strategies.12:
+        "0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7"
    }
```

```diff
+   Status: CREATED
    contract EIGEN Timelock (0x2520C6b2C1FBE1813AB5c7c1018CDa39529e9FF2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract bEIGEN token (0x83E9115d334D248Ce39a6f36144aEaB5b3456e75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract bEIGEN-Strategy (0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xB8915E195121f2B5D989Ec5727fd47a5259F1CEC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenlayerTokenMultisig (0xbb00DDa2832850a43840A3A86515E3Fe226865F2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract bEIGEN Timelock (0xd6EC41E453C5E7dA5494f4d51A053Ab571712E6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIGEN token (0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83)
    +++ description: None
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             |  248 +++++
 .../contracts/access/IAccessControl.sol            |   88 ++
 .../contracts/governance/TimelockController.sol    |  422 ++++++++
 .../contracts/token/ERC1155/IERC1155Receiver.sol   |   58 +
 .../contracts/token/ERC721/IERC721Receiver.sol     |   27 +
 .../contracts/utils/Context.sol                    |    0
 .../contracts/utils/Strings.sol                    |   85 ++
 .../contracts/utils/introspection/ERC165.sol       |   29 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  339 ++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../ethereum/.code/EIGEN Timelock/meta.txt         |    2 +
 .../contracts/token/ERC20/IERC20.sol               |   78 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../contracts/interfaces/IERC5267Upgradeable.sol   |   28 +
 .../contracts/interfaces/IERC5805Upgradeable.sol   |    9 +
 .../contracts/interfaces/IERC6372Upgradeable.sol   |   17 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/token/ERC20/ERC20Upgradeable.sol     |  377 +++++++
 .../contracts/token/ERC20/IERC20Upgradeable.sol    |   78 ++
 .../ERC20/extensions/ERC20PermitUpgradeable.sol    |  109 ++
 .../ERC20/extensions/ERC20VotesUpgradeable.sol     |  303 ++++++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 ++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../contracts/utils/CountersUpgradeable.sol        |   43 +
 .../contracts/utils/StringsUpgradeable.sol         |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../contracts/utils/math/MathUpgradeable.sol       |  339 ++++++
 .../contracts/utils/math/SafeCastUpgradeable.sol   | 1136 ++++++++++++++++++++
 .../contracts/utils/math/SignedMathUpgradeable.sol |   43 +
 .../.code/EIGEN token/implementation/meta.txt      |    2 +
 .../.code/EIGEN token/implementation/src/Eigen.sol |  171 +++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |    0
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |    0
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../contracts/proxy/Proxy.sol                      |    0
 .../contracts/proxy/beacon/IBeacon.sol             |    0
 .../transparent/TransparentUpgradeableProxy.sol    |  191 ++++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/utils/StorageSlot.sol                |  138 +++
 .../ethereum/.code/EIGEN token/proxy/meta.txt      |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/EigenlayerTokenMultisig/proxy/meta.txt   |    2 +
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../contracts/proxy/Proxy.sol                      |   86 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  191 ++++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/StorageSlot.sol                |  138 +++
 .../meta.txt                                       |    2 +
 .../contracts/access/Ownable.sol                   |    0
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |    0
 .../contracts/proxy/Proxy.sol                      |   86 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |    0
 .../transparent/TransparentUpgradeableProxy.sol    |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/StorageSlot.sol                |    0
 .../meta.txt                                       |    0
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../contracts/proxy/Proxy.sol                      |   86 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  191 ++++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/StorageSlot.sol                |  138 +++
 .../meta.txt                                       |    2 +
 .../contracts/access/AccessControl.sol             |  248 +++++
 .../contracts/access/IAccessControl.sol            |   88 ++
 .../contracts/governance/TimelockController.sol    |  422 ++++++++
 .../contracts/token/ERC1155/IERC1155Receiver.sol   |   58 +
 .../contracts/token/ERC721/IERC721Receiver.sol     |   27 +
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   85 ++
 .../contracts/utils/introspection/ERC165.sol       |   29 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  339 ++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../ethereum/.code/bEIGEN Timelock/meta.txt        |    2 +
 .../contracts/token/ERC20/IERC20.sol               |   78 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../contracts/interfaces/IERC5267Upgradeable.sol   |   28 +
 .../contracts/interfaces/IERC5805Upgradeable.sol   |    9 +
 .../contracts/interfaces/IERC6372Upgradeable.sol   |   17 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/token/ERC20/ERC20Upgradeable.sol     |  377 +++++++
 .../contracts/token/ERC20/IERC20Upgradeable.sol    |   78 ++
 .../ERC20/extensions/ERC20PermitUpgradeable.sol    |  109 ++
 .../ERC20/extensions/ERC20VotesUpgradeable.sol     |  303 ++++++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 ++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../contracts/utils/CountersUpgradeable.sol        |   43 +
 .../contracts/utils/StringsUpgradeable.sol         |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../contracts/utils/math/MathUpgradeable.sol       |  339 ++++++
 .../contracts/utils/math/SafeCastUpgradeable.sol   | 1136 ++++++++++++++++++++
 .../contracts/utils/math/SignedMathUpgradeable.sol |   43 +
 .../.code/bEIGEN token/implementation/meta.txt     |    2 +
 .../implementation/src/BackingEigen.sol            |  132 +++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../contracts/proxy/Proxy.sol                      |   86 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  191 ++++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/utils/StorageSlot.sol                |  138 +++
 .../ethereum/.code/bEIGEN token/proxy/meta.txt     |    2 +
 .../contracts/interfaces/IBeaconChainOracle.sol    |   12 +
 .../contracts/interfaces/IDelegationManager.sol    |  466 ++++++++
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |   41 +
 .../src/contracts/interfaces/IEigenPod.sol         |  223 ++++
 .../src/contracts/interfaces/IEigenPodManager.sol  |  165 +++
 .../src/contracts/interfaces/IPausable.sol         |   65 ++
 .../src/contracts/interfaces/IPauserRegistry.sol   |   19 +
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |  195 ++++
 .../src/contracts/interfaces/IStrategy.sol         |   95 ++
 .../src/contracts/interfaces/IStrategyManager.sol  |  161 +++
 .../src/contracts/libraries/BeaconChainProofs.sol  |  442 ++++++++
 .../src/contracts/libraries/Endian.sol             |   25 +
 .../src/contracts/libraries/Merkle.sol             |  172 +++
 .../src/contracts/permissions/Pausable.sol         |  136 +++
 .../src/contracts/strategies/StrategyBase.sol      |  292 +++++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/token/ERC20/IERC20.sol               |   78 ++
 .../token/ERC20/extensions/IERC20Permit.sol        |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  143 +++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../.code/bEIGEN-Strategy/implementation/meta.txt  |    2 +
 .../implementation/src/EigenStrategy.sol           |  107 ++
 .../implementation/src/interfaces/IEigen.sol       |   54 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../contracts/proxy/Proxy.sol                      |   86 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  191 ++++
 .../contracts/utils/Address.sol                    |  244 +++++
 .../contracts/utils/StorageSlot.sol                |  138 +++
 .../ethereum/.code/bEIGEN-Strategy/proxy/meta.txt  |    2 +
 184 files changed, 20412 insertions(+)
```

Generated with discovered.json: 0xcffb6b02de5bb310768147ee3220a56f9af3bdb0

# Diff at Tue, 23 Apr 2024 22:44:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@f6f4ef80f0b2193da88313a911968b74fcfed02f block: 19531533
- current block number: 19721151

## Description

Eigenlayer m2 mainnet release ([v0.2.3 release notes](https://hackmd.io/@-HV50kYcRqOjl_7du8m1AA/ryx1p-Bm1C))
Stakers can now delegate stake to Operators, who can register with AVSs.
Current Governance of Eigenlayer (excluding EigenDA): Community Multisig (9/13) OR Operations Multisig (3/6) (10d delay) can upgrade all Eigenlayer smart contracts.

The linked release notes describe this update well, below is a shorter changelog from manually skimming over the contracts.

### AVSDirectory

AVSs register/deregister their Operators here. (only two functions)
Payment of operators and slashing is not implemented yet.

### DelegationManager

Stakers use this contract for delegating/undelegating their stake.

- (queue)Withdrawal functions are moved here now (from the StrategyManager)
- Use EIP1271SignatureUtils to check signatures made by contracts (by stakers/eigenpods). This standard also allows human readable signatures on signing
- Plenty events and comments added
- onlyStrategyManagerOrEigenPodManager() modifier for the `delegateShares` functions

### StrategyManager

Does the accounting for deposits / withdrawals of LSTs into / from strategies by individual stakers. (shares)

- The DelegationManager is the entry for initiating a withdrawal, while the StrategyManager is the entry for depositing
- Slashing is not implemented

### EigenPodManager

Lets ethereum native restakers create EigenPods and tracks the EigenPod's shares. Shares can be increased/decreased by the DelegationManager.

- Withdrawal processing now interacts via the DelegationManager, not the StrategyManager
- Withdrawals are started here and proven in the Eigenpod SC

### Eigenpod

Escrow smart contract that is the withdrawal address / credentials for ETH native eigenlayer restakers.

- Beacon chain state proofs are introduced (using EIP-4788: Beacon block root oracle)
- Withdrawals are sent here from the beacon chain, can be withdrawn from the pod via DelegationManager-->EigenPodManager-->Eigenpod
- User (owner of the EigenPod) can only withdraw non-restaked ETH and other tokens that are accidentally sent to the pod directly with user-facing functions (onlyEigenPodOwner)

### DelayedWithdrawalRouter

Now only needed for withdrawals that are unrelated to shares (which in turn are managed by the DelegationManager):

- Consensus rewards
- ETH or tokens sent to the EigenPod directly (/ accidently)

Maximum delay is raised from 7d to 30d.

### Slasher

Skeleton contract that is not used. (The previously deployed version was paused) Eigenlayer currently has no slashing functionality.

## Watched changes

```diff
    contract AVSDirectory (0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF) {
    +++ description: None
      values.avs.8:
+        "0xE5445838C475A2980e6a88054ff1514230b83aEb"
      values.avs.7:
+        "0xed2f4d90b073128ae6769a9A8D51547B1Df766C8"
      values.avs.6:
+        "0x23221c5bB90C7c57ecc1E75513e2E4257673F0ef"
      values.avs.5:
+        "0x35F4f28A8d3Ff20EEd10e087e8F96Ea2641E6AA2"
      values.avs.4:
+        "0x6026b61bDD2252160691CB3F6005B6B72E0Ec044"
      values.avs.3:
+        "0x71a77037870169d47aad6c2C9360861A4C0df2bF"
      values.avs.2:
+        "0x9FC952BdCbB7Daca7d420fA55b942405B073A89d"
      values.avs.1:
+        "0xD25c2c5802198CB8541987b73A8db4c9BCaE5cC7"
      values.avs.0:
+        "0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0"
    }
```

```diff
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) {
    +++ description: Manages interactions between stakers and Eigenlayer operators, registers operators.
      upgradeability.implementation:
-        "0xf97E97649Da958d290e84E6D571c32F4b7F475e4"
+        "0x1784BE6401339Fc0Fedf7E9379409f5c1BfE9dda"
      implementations.0:
-        "0xf97E97649Da958d290e84E6D571c32F4b7F475e4"
+        "0x1784BE6401339Fc0Fedf7E9379409f5c1BfE9dda"
      values.DELEGATION_TYPEHASH:
-        "0xb2a21c2f78b6ef501475a2971550fe4cedb86f0dec990e23909bfb01fd61c54c"
      values.DOMAIN_SEPARATOR:
-        "0x9bba7f98dd592dbd3fdbeef9fdebb4e19f8661950cb5dcc435fcad7824975fe1"
      values.paused:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
+        0
      values.beaconChainETHStrategy:
+        "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0"
      values.DELEGATION_APPROVAL_TYPEHASH:
+        "0x14bde674c9f64b2ad00eaaee4a8bed1fabef35c7507e3c5b9cfc9436909a2dad"
      values.domainSeparator:
+        "0x9bba7f98dd592dbd3fdbeef9fdebb4e19f8661950cb5dcc435fcad7824975fe1"
      values.eigenPodManager:
+        "0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338"
      values.MAX_STAKER_OPT_OUT_WINDOW_BLOCKS:
+        1296000
      values.MAX_WITHDRAWAL_DELAY_BLOCKS:
+        216000
      values.minWithdrawalDelayBlocks:
+        50400
      values.STAKER_DELEGATION_TYPEHASH:
+        "0x39111bc4a4d688e1f685123d7497d4615370152a8ee4a0593e647bd06ad8bb0b"
    }
```

```diff
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073) {
    +++ description: None
      values.implementation:
-        "0x5c86e9609fbBc1B754D0FD5a4963Fdf0F5b99dA7"
+        "0x8bA40dA60f0827d027F029aCEE62609F0527a255"
    }
```

```diff
-   Status: DELETED
    contract EigenPod (0x5c86e9609fbBc1B754D0FD5a4963Fdf0F5b99dA7)
    +++ description: None
```

```diff
    contract DelayedWithdrawalRouter (0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8) {
    +++ description: None
      upgradeability.implementation:
-        "0x44Bcb0E01CD0C5060D4Bb1A07b42580EF983E2AF"
+        "0x4bB6731B02314d40aBbfFBC4540f508874014226"
      implementations.0:
-        "0x44Bcb0E01CD0C5060D4Bb1A07b42580EF983E2AF"
+        "0x4bB6731B02314d40aBbfFBC4540f508874014226"
      values.MAX_WITHDRAWAL_DELAY_BLOCKS:
-        50400
+        216000
    }
```

```diff
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
    +++ description: The entry- and exit-point for funds into and out of EigenLayer, manages strategies.
      upgradeability.implementation:
-        "0x5d25EEf8CfEdaA47d31fE2346726dE1c21e342Fb"
+        "0x70f44C13944d49a236E3cD7a94f48f5daB6C619b"
      implementations.0:
-        "0x5d25EEf8CfEdaA47d31fE2346726dE1c21e342Fb"
+        "0x70f44C13944d49a236E3cD7a94f48f5daB6C619b"
      values.beaconChainETHStrategy:
-        "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0"
      values.DEPOSIT_TYPEHASH:
-        "0x0a564d4cfe5cb0d4ee082aab2ca54b8c48e129485a8f7c77766ab5ef0c3566f1"
+        "0x4337f82d142e41f2a8c10547cd8c859bddb92262a61058e77842e24d9dea9224"
      values.DOMAIN_SEPARATOR:
-        "0xdaba058ab21f198a04ec80cf0d39f943660a92a99bda5de5016f923f7e4962ef"
      values.MAX_WITHDRAWAL_DELAY_BLOCKS:
-        50400
      values.paused:
-        1
+        0
      values.withdrawalDelayBlocks:
-        50400
      values.domainSeparator:
+        "0xdaba058ab21f198a04ec80cf0d39f943660a92a99bda5de5016f923f7e4962ef"
    }
```

```diff
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338) {
    +++ description: None
      upgradeability.implementation:
-        "0xEB86a5c40FdE917E6feC440aBbCDc80E3862e111"
+        "0xe4297e3DaDBc7D99e26a2954820f514CB50C5762"
      implementations.0:
-        "0xEB86a5c40FdE917E6feC440aBbCDc80E3862e111"
+        "0xe4297e3DaDBc7D99e26a2954820f514CB50C5762"
      values.beaconChainOracle:
-        "0x0000000000000000000000000000000000000000"
+        "0x343907185b71aDF0eBa9567538314396aa985442"
      values.maxPods:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.paused:
-        30
+        0
      values.beaconChainETHStrategy:
+        "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0"
      values.delegationManager:
+        "0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A"
      values.denebForkTimestamp:
+        1710338135
    }
```

```diff
    contract Slasher (0xD92145c07f8Ed1D392c1B88017934E301CC1c3Cd) {
    +++ description: Registers contracts with slashing rights, tracks historic stake updates.
      upgradeability.implementation:
-        "0xef31c292801f24f16479DD83197F1E6AeBb8d6d8"
+        "0xF3234220163a757edf1E11a8a085638D9B236614"
      implementations.0:
-        "0xef31c292801f24f16479DD83197F1E6AeBb8d6d8"
+        "0xF3234220163a757edf1E11a8a085638D9B236614"
      values.delegation:
-        "0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A"
+        "0x0000000000000000000000000000000000000000"
      values.strategyManager:
-        "0x858646372CC42E1A627fcE94aa7A7033e7CF075A"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract EigenLayerBeaconOracle (0x343907185b71aDF0eBa9567538314396aa985442)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (0x8bA40dA60f0827d027F029aCEE62609F0527a255)
    +++ description: None
```

## Source code changes

```diff
.../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../implementation/meta.txt                        |    2 +-
 .../contracts/interfaces/IBeaconChainOracle.sol    |   59 +-
 .../interfaces/IDelayedWithdrawalRouter.sol        |   17 +-
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |   41 +
 .../src/contracts/interfaces/IEigenPod.sol         |  214 ++--
 .../src/contracts/interfaces/IEigenPodManager.sol  |  144 ++-
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  456 +++++---
 .../src/contracts/libraries/Endian.sol             |    6 +-
 .../src/contracts/libraries/Merkle.sol             |   80 +-
 .../src/contracts/permissions/Pausable.sol         |   23 +-
 .../src/contracts/pods/DelayedWithdrawalRouter.sol |  114 +-
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../security/ReentrancyGuardUpgradeable.sol        |   75 ++
 .../DelegationManager/implementation/meta.txt      |    2 +-
 .../src/contracts/core/DelegationManager.sol       | 1148 +++++++++++++++-----
 .../contracts/core/DelegationManagerStorage.sol    |   93 +-
 .../src/contracts/core/Slasher.sol => /dev/null    |  563 ----------
 .../contracts/interfaces/IBeaconChainOracle.sol    |   12 +
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |   41 +
 .../src/contracts/interfaces/IEigenPod.sol         |  223 ++++
 .../src/contracts/interfaces/IEigenPodManager.sol  |  159 +++
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  409 +++++++
 .../contracts/libraries/EIP1271SignatureUtils.sol  |   41 +
 .../src/contracts/libraries/Endian.sol             |   25 +
 .../src/contracts/libraries/Merkle.sol             |  172 +++
 .../StructuredLinkedList.sol => /dev/null          |  258 -----
 .../src/contracts/permissions/Pausable.sol         |   23 +-
 .../ethereum/.code/EigenLayerBeaconOracle/meta.txt |    2 +
 .../src/EigenLayerBeaconOracle.sol                 |   91 ++
 .../src/IBeaconChainOracle.sol                     |   12 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/MathUpgradeable.sol       |  226 ++++
 .../{.code@19531533 => .code}/EigenPod/meta.txt    |    2 +-
 .../contracts/interfaces/IBeaconChainOracle.sol    |   59 +-
 .../interfaces/IDelayedWithdrawalRouter.sol        |   17 +-
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |    2 +-
 .../src/contracts/interfaces/IEigenPod.sol         |  214 ++--
 .../src/contracts/interfaces/IEigenPodManager.sol  |  144 ++-
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../EigenPod/src/contracts/interfaces/ISlasher.sol |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  456 +++++---
 .../EigenPod/src/contracts/libraries/BytesLib.sol  |   30 +-
 .../EigenPod/src/contracts/libraries/Endian.sol    |    6 +-
 .../EigenPod/src/contracts/libraries/Merkle.sol    |   80 +-
 .../EigenPod/src/contracts/pods/EigenPod.sol       |  894 ++++++++++-----
 .../contracts/pods/EigenPodPausingConstants.sol    |   15 +-
 .../interfaces/draft-IERC1822.sol => /dev/null     |   20 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  185 ----
 .../contracts/proxy/Proxy.sol => /dev/null         |   86 --
 .../proxy/beacon/BeaconProxy.sol => /dev/null      |   61 --
 .../contracts/utils/StorageSlot.sol => /dev/null   |   88 --
 .../security/ReentrancyGuardUpgradeable.sol        |   75 ++
 .../EigenPodManager/implementation/meta.txt        |    2 +-
 .../contracts/interfaces/IBeaconChainOracle.sol    |   59 +-
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |    2 +-
 .../src/contracts/interfaces/IEigenPod.sol         |  214 ++--
 .../src/contracts/interfaces/IEigenPodManager.sol  |  144 ++-
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  456 +++++---
 .../src/contracts/libraries/Endian.sol             |    6 +-
 .../src/contracts/libraries/Merkle.sol             |   80 +-
 .../src/contracts/permissions/Pausable.sol         |   23 +-
 .../src/contracts/pods/EigenPodManager.sol         |  339 +++---
 .../src/contracts/pods/EigenPodManagerStorage.sol  |   90 ++
 .../contracts/pods/EigenPodPausingConstants.sol    |   15 +-
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../Slasher/implementation/meta.txt                |    2 +-
 .../implementation/src/contracts/core/Slasher.sol  |  591 ++--------
 .../contracts/interfaces/IBeaconChainOracle.sol    |   12 +
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |   41 +
 .../src/contracts/interfaces/IEigenPod.sol         |  223 ++++
 .../src/contracts/interfaces/IEigenPodManager.sol  |  159 +++
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  409 +++++++
 .../src/contracts/libraries/Endian.sol             |   25 +
 .../src/contracts/libraries/Merkle.sol             |  172 +++
 .../contracts/libraries/StructuredLinkedList.sol   |    2 +-
 .../src/contracts/permissions/Pausable.sol         |   23 +-
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../StrategyManager/implementation/meta.txt        |    2 +-
 .../src/contracts/core/StrategyManager.sol         |  892 ++++-----------
 .../src/contracts/core/StrategyManagerStorage.sol  |   64 +-
 .../contracts/interfaces/IBeaconChainOracle.sol    |   59 +-
 .../contracts/interfaces/IDelegationManager.sol    |  471 +++++++-
 .../interfaces/IDelegationTerms.sol => /dev/null   |   26 -
 .../src/contracts/interfaces/IETHPOSDeposit.sol    |   41 +
 .../src/contracts/interfaces/IEigenPod.sol         |  214 ++--
 .../src/contracts/interfaces/IEigenPodManager.sol  |  144 ++-
 .../src/contracts/interfaces/IPausable.sol         |   13 +-
 .../src/contracts/interfaces/IPauserRegistry.sol   |    6 +-
 .../src/contracts/interfaces/ISignatureUtils.sol   |   27 +
 .../src/contracts/interfaces/ISlasher.sol          |   84 +-
 .../src/contracts/interfaces/IStrategy.sol         |   16 +-
 .../src/contracts/interfaces/IStrategyManager.sol  |  262 ++---
 .../src/contracts/libraries/BeaconChainProofs.sol  |  456 +++++---
 .../contracts/libraries/EIP1271SignatureUtils.sol  |   41 +
 .../src/contracts/libraries/Endian.sol             |    6 +-
 .../src/contracts/libraries/Merkle.sol             |   80 +-
 .../src/contracts/permissions/Pausable.sol         |   23 +-
 139 files changed, 11631 insertions(+), 6331 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531533 (main branch discovery), not current.

```diff
    contract OperationsMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      name:
-        "OperationsMultisig"
+        "EigenlayerOperationsMultisig"
    }
```

```diff
    contract EigenlayerMultisig (0xFEA47018D632A77bA579846c840d5706705Dc598) {
    +++ description: None
      name:
-        "EigenlayerMultisig"
+        "EigenlayerCommunityMultisig"
    }
```

```diff
+   Status: CREATED
    contract AVSDirectory (0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

Generated with discovered.json: 0x4160c726f419fb6cd7fa8ba5138b175ccbb7b131

# Diff at Thu, 28 Mar 2024 08:51:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19433765
- current block number: 19531533

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19433765 (main branch discovery), not current.

```diff
    contract EigenlayerProxiedMultisig (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

```diff
    contract OperationsMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: The Operations Multisig (3/6) can execute routine upgrades, maintenance and pausing of all strategies directly. It can execute safety-critical updates with a 10-day timelock.
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract EigenlayerMultisig (0xFEA47018D632A77bA579846c840d5706705Dc598) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 13 (69%)"
    }
```

Generated with discovered.json: 0xba1f897d9f970202dbca6c5ec09288933e54ecf9

# Diff at Thu, 14 Mar 2024 14:14:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19426942
- current block number: 19433765

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19426942 (main branch discovery), not current.

```diff
    contract StrategyAdderMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      name:
-        "StrategyAdderMultisig"
+        "OperationsMultisig"
    }
```

Generated with discovered.json: 0xb0b6ecabe9b24b41963f90909c5038c5e4c06888

# Diff at Wed, 13 Mar 2024 15:08:26 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8ded78dbad1caa69ad22c20ef413872cafeb6a2f block: 19425552
- current block number: 19426942

## Description

One Eigenlayer Operations Multisig signer is removed. This leaves the multisig at the 3/6 threshold, as per Eigenlayer docs.

## Watched changes

```diff
    contract StrategyAdderMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      values.getOwners[6]:
-        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.5:
-        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
    }
```

Generated with discovered.json: 0x387c23ea428e460f5385d4e061c45b5803b0e48c

# Diff at Wed, 13 Mar 2024 10:28:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5f8229a0d203f1ab563faeb4f951a6cc4a12068c block: 19418224
- current block number: 19425552

## Description

Three new signers are added to the Eigenlayer Operations Multisig.
Only one is actually removed so far, so the multisig is currently 3/7.
Eigenlayer docs reference this multisig as 3/6.

## Watched changes

```diff
    contract StrategyAdderMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      values.getOwners[6]:
+        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
      values.getOwners[5]:
+        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.4:
-        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
+        "0xeD7Ef087d1C01ecCA9a9688a44aaeDDEf4ea560E"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.3:
-        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+        "0x422e2F724faFE75F3635458aD7D3Ac803DCD7ff1"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.2:
-        "0xeD7Ef087d1C01ecCA9a9688a44aaeDDEf4ea560E"
+        "0x27ff193A6A1574A611E21c39FDA636fA1d61ba30"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.1:
-        "0x422e2F724faFE75F3635458aD7D3Ac803DCD7ff1"
+        "0xb7Ae34BB33da55f12797e793E01e63a17B11d108"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.0:
-        "0xe479a0839F13117f42142AD6cE71B49a97c1c928"
+        "0xa2425B00F9A9457AEdd51d4C36d9917eA1Aa7a02"
    }
```

Generated with discovered.json: 0x7e752b312976dbd0b9a0d36ec7ec6aba97d5a5ed

# Diff at Tue, 12 Mar 2024 09:54:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b31b4cc06f0d914e438132f7f1fac02623f5d180 block: 19033739
- current block number: 19418224

## Description

All deposit caps for the 12 supported liquid staking tokens are increased to the maximum value on Feb 5th 2024.

## Watched changes

```diff
    contract swETH-Strategy (0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract ankrETH-Strategy (0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract rETH-Strategy (0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract METH-Strategy (0x298aFB19A105D59E74658C4C334Ff360BadE6dd2) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract cbETH-Strategy (0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract osETH-Strategy (0x57ba429517c3473B6d34CA9aCd56c0e735b94c02) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract wBETH-Strategy (0x7CA911E83dabf90C90dD3De5411a10F1A6112184) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract sfrxETH-Strategy (0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract stETH-Strategy (0x93c4b944D05dfe6df7645A86cd2206016c51564D) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract ETHx-Strategy (0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract OETH-Strategy (0xa4C637e0F704745D182e4D38cAb7E7485321d059) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract RiverV1-Strategy (0xAe60d8180437b5C34bB956822ac2710972584473) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

Generated with discovered.json: 0x5ba0aee464a1a3009c8ec05ef3059665fe93da42

# Diff at Thu, 18 Jan 2024 12:26:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d613299eac1f45b1c81fd947b8300beb800ba170 block: 18992027
- current block number: 19033739

## Description

Added three new strategies.
Named three present multisigs and ignored their nonce in watch mode.

## Watched changes

```diff
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
      values.strategies[11]:
+        "0x298aFB19A105D59E74658C4C334Ff360BadE6dd2"
      values.strategies[10]:
+        "0xAe60d8180437b5C34bB956822ac2710972584473"
      values.strategies[9]:
+        "0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6"
    }
```

```diff
+   Status: CREATED
    contract METH-Strategy (0x298aFB19A105D59E74658C4C334Ff360BadE6dd2) {
    }
```

```diff
+   Status: CREATED
    contract sfrxETH-Strategy (0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6) {
    }
```

```diff
+   Status: CREATED
    contract RiverV1-Strategy (0xAe60d8180437b5C34bB956822ac2710972584473) {
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/METH-Strategy/implementation/meta.txt    |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/METH-Strategy/proxy/meta.txt    |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/METH-Strategy/proxy/proxy/Proxy.sol      |  86 +++++++
 .../METH-Strategy/proxy/proxy/beacon/IBeacon.sol   |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/METH-Strategy/proxy/utils/Address.sol    | 222 ++++++++++++++++
 .../METH-Strategy/proxy/utils/StorageSlot.sol      |  88 +++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/RiverV1-Strategy/implementation/meta.txt |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/RiverV1-Strategy/proxy/meta.txt |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/RiverV1-Strategy/proxy/proxy/Proxy.sol   |  86 +++++++
 .../proxy/proxy/beacon/IBeacon.sol                 |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/RiverV1-Strategy/proxy/utils/Address.sol | 222 ++++++++++++++++
 .../RiverV1-Strategy/proxy/utils/StorageSlot.sol   |  88 +++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/sfrxETH-Strategy/implementation/meta.txt |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/sfrxETH-Strategy/proxy/meta.txt |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/sfrxETH-Strategy/proxy/proxy/Proxy.sol   |  86 +++++++
 .../proxy/proxy/beacon/IBeacon.sol                 |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/sfrxETH-Strategy/proxy/utils/Address.sol | 222 ++++++++++++++++
 .../sfrxETH-Strategy/proxy/utils/StorageSlot.sol   |  88 +++++++
 78 files changed, 8277 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18992027 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
      name:
-        "GnosisSafe"
+        "EigenlayerProxiedMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
      name:
-        "GnosisSafe"
+        "StrategyAdderMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598) {
      name:
-        "GnosisSafe"
+        "EigenlayerMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Fri, 12 Jan 2024 16:33:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bd17b9c403f8c2dc9783e9604ccb1874d7f77cb5 block: 18940531
- current block number: 18992027

## Description

The number of EigenPods (contracts, to which validators’ withdrawal credentials point, and where consensus layer rewards accrue) have increased. Changes in the DepositContract deposits.
All these values are now ignored in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18940531 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
      derivedName:
+        "DepositContract"
    }
```

```diff
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338) {
      derivedName:
+        "EigenPodManager"
    }
```

# Diff at Fri, 05 Jan 2024 10:39:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@

## Description

Initial discovery.

## Watched changes

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    }
```

```diff
+   Status: CREATED
    contract PauserRegistry (0x0c431C66F4dE941d089625E5B423D00707977060) {
    }
```

```diff
+   Status: CREATED
    contract swETH-Strategy (0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6) {
    }
```

```diff
+   Status: CREATED
    contract ankrETH-Strategy (0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff) {
    }
```

```diff
+   Status: CREATED
    contract rETH-Strategy (0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
    }
```

```diff
+   Status: CREATED
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) {
    }
```

```diff
+   Status: CREATED
    contract cbETH-Strategy (0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc) {
    }
```

```diff
+   Status: CREATED
    contract osETH-Strategy (0x57ba429517c3473B6d34CA9aCd56c0e735b94c02) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073) {
    }
```

```diff
+   Status: CREATED
    contract EigenPod (0x5c86e9609fbBc1B754D0FD5a4963Fdf0F5b99dA7) {
    }
```

```diff
+   Status: CREATED
    contract wBETH-Strategy (0x7CA911E83dabf90C90dD3De5411a10F1A6112184) {
    }
```

```diff
+   Status: CREATED
    contract DelayedWithdrawalRouter (0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8) {
    }
```

```diff
+   Status: CREATED
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444) {
    }
```

```diff
+   Status: CREATED
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338) {
    }
```

```diff
+   Status: CREATED
    contract stETH-Strategy (0x93c4b944D05dfe6df7645A86cd2206016c51564D) {
    }
```

```diff
+   Status: CREATED
    contract ETHx-Strategy (0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d) {
    }
```

```diff
+   Status: CREATED
    contract OETH-Strategy (0xa4C637e0F704745D182e4D38cAb7E7485321d059) {
    }
```

```diff
+   Status: CREATED
    contract Timelock (0xA6Db1A8C5a981d1536266D2a393c5F8dDb210EAF) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    }
```

```diff
+   Status: CREATED
    contract Slasher (0xD92145c07f8Ed1D392c1B88017934E301CC1c3Cd) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598) {
    }
```