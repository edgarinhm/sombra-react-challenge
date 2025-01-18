/*
 * Your task is to:
 * 1. Load the list of wizards when the page loads.
 * 2. Once the list of wizards has loaded, render the list of wizards (first and last name) in an unordered list.
 * 3. For each wizard, list out each elixir they have (name and effect).
 */
import { useEffect, useState } from "react";
import { index } from '@react-router/dev/routes';

/**
 * The data comes from https://wizard-world-api.herokuapp.com/swagger/index.html
 */
interface Elixir {
  id: string;
  name: string;
  effect: string | null;
}

interface Wizard {
  firstName: string | null;
  lastName: string | null;
  id: string;
  elixirs: Pick<Elixir, "id" | "name" | "effect">[];
}

export function Wizard() {
  const getWizards = async (): Promise<Wizard[] | undefined> => {
    try {
      const res = await fetch("https://wizard-world-api.herokuapp.com/Wizards");
      if (!res.ok) {
        throw new Error("Unable to get wizards");
      }
      return res.json() as Promise<Wizard[]>;
    } catch (error: any) {
      setErrorMessage(`Error Loading Wizards: ${error?.message}`);
    }
  };

  const getElixir = async (id: string): Promise<Elixir | undefined>  => {
    try {
      const res = await fetch(
        `https://wizard-world-api.herokuapp.com/Elixirs/${id}`
      );
      if (!res.ok) {
        throw new Error("Unable to get elixir");
      }
      return res.json() as Promise<Elixir>;
    } catch (error: any) {
      setErrorMessage(`Error Loading Elixir: ${error?.message}`);
    }
  };

  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const wizardsData = await getWizards();
      const elixirPromises = wizardsData?.map(async (wizard) => {
        const elixirsData = wizard.elixirs.map(async (elixir) => {
            const elixirResponse =  await getElixir(elixir.id);
            return { id: elixirResponse?.id, name: elixirResponse?.name, effect:elixirResponse?.effect } as Pick<Elixir, "id" | "name" | "effect">
        });
        return {
          ...wizard,
          elixirs: await Promise.all(elixirsData),
        };
      });
      if(elixirPromises){
        const allElixirs = await Promise.all(elixirPromises);
        allElixirs && setWizards(allElixirs);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="d-flex px-4 py-2">
    {errorMessage && (<span>{errorMessage}</span>)}      
      {isLoading === true ? (
        <>{'...Loading'}</>
      ) : (
        <ul className="list-outside">
          {isLoading === false &&
            wizards.map((wizard, index) => {
              return (
                <li key={wizard.id}>
                  <span className="font-bold">{`Wizard.${index+1}: ${wizard.firstName ?? ""} ${ wizard.lastName ?? ""}`}</span>
                  <span>
                    <ul className="list-inside">
                      {wizard?.elixirs?.map((elixir, index) => {
                        return (
                          <li key={elixir.id} className="ml-2"><span className="font-semibold">{`Elixir.${index+1}: `}</span>{`${elixir.name}: ${elixir.effect}`}</li>
                        );
                      })}
                    </ul>
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
