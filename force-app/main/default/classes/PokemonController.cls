public with sharing class PokemonController {
    @AuraEnabled(cacheable=true scope='global')
    public static Pokemon__c[] getAllPokemons() {
        return [
            SELECT
                ExtId__c,
                Name,
                Altura__c,
                Ataque__c,
                Defensa__c,
                Generacion__c,
                Habilidad__c,
                Imagen__c,
                Numero_de_Pokemon__c,
                Peso__c,
                Slot1__c,
                Slot2__c,
                Slot3__c,
                Slot4__c,
                Tipos__c,
                Velocidad__c,
                Vida__c
            FROM Pokemon__c
            WITH SECURITY_ENFORCED
            ORDER BY ExtId__c
            LIMIT 898
        ];
    }

    private static List<Integer> getStartAndEndFromGeneration(String generation) {
        Map<String, List<Integer>> generationStartAndEnd = new Map<String, List<Integer>>{
            '1' => new List<Integer>{1, 151},
            '2' => new List<Integer>{152, 251},
            '3' => new List<Integer>{252, 386},
            '4' => new List<Integer>{387, 493},
            '5' => new List<Integer>{494, 649},
            '6' => new List<Integer>{650, 721},
            '7' => new List<Integer>{722, 809},
            '8' => new List<Integer>{810, 898}
        };
        return generationStartAndEnd.get(generation);
    }

    public static List<Pokemon__c> filterPokemonsInGeneration(List<Pokemon__c> pkms, String generation) {
        List<Integer> startAndEnd = getStartAndEndFromGeneration(generation);
        Integer startGen = startAndEnd[0];
        Integer endGen = startAndEnd[1];

        List<Pokemon__c> filteredPokemons = new List<Pokemon__c>();
        
        for(Pokemon__c pokemon: pkms){
            if (pokemon.ExtId__c >= startGen && pokemon.ExtId__c <= endGen){
                filteredPokemons.add(pokemon);
            }
        }

        return filteredPokemons;
    }

    @AuraEnabled(cacheable=true scope='global')
    public static Pokemon__c[] filterByEverything(SearchWrapper wrapper) {
        if (wrapper.searchName == '' && wrapper.filterTypes == '' && wrapper.filterGeneration == '') {
            return getAllPokemons();
        }

        String query = 'SELECT ExtId__c, Name, Altura__c, Ataque__c, Defensa__c, Generacion__c, Habilidad__c, Imagen__c, Numero_de_Pokemon__c, Peso__c, Slot1__c, Slot2__c, Slot3__c, Slot4__c, Tipos__c, Velocidad__c, Vida__c '
        + 'FROM Pokemon__c ';

        if (wrapper.searchName != '' || wrapper.filterTypes != '') {
            query = query + 'WHERE ';
        }

        if (wrapper.searchName != '') {
            String name = '%' + wrapper.searchName + '%';
            query = query + 'Name LIKE ' + ':name';
            if (wrapper.filterTypes != '') {
                query = query + ' AND ';
            }
        }

        if (wrapper.filterTypes != '') {
            String types = wrapper.filterTypes;
            query = query + 'Tipos__c includes ' + '(:types)';
        }


        query = query + ' WITH SECURITY_ENFORCED ORDER BY ExtId__c';

        List<Pokemon__c> pkmResults = (List<Pokemon__c>)Database.query(query);
        if (wrapper.filterGeneration != '') {
            return filterPokemonsInGeneration(pkmResults, wrapper.filterGeneration);
        }
        
        return pkmResults;

    }
}