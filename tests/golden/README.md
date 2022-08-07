This is almost a copy of
[golden fixtures](https://github.com/spacemeshos/go-spacemesh/tree/develop/genvm/templates/wallet/golden)
from `go-spacemesh` repo
([b6a8aca](https://github.com/spacemeshos/go-spacemesh/commit/b6a8aca44fe786d9a63788499d7fa9f78abb9a84)).

The only changes that each fixture wrapped into array to make possible to have few fixtures for the same codec. Especially, since `SpawnArgument` already have two fixtures, but in original this is not a valid JSON.