module Main where

import RestyScript.Parser.View
import RestyScript.Parser.Action
import RestyScript.AST

import qualified RestyScript.Emitter.RestyScript as RS
import qualified RestyScript.Emitter.Stats as St
import qualified RestyScript.Emitter.RenameVar as Re
import qualified RestyScript.Emitter.Fragments as Fr

import System
import System.IO
import System.Exit
import qualified Data.ByteString.Char8 as B

argHandles :: [(String, RSVal -> IO ())]
argHandles = [
    ("rs", B.putStrLn . RS.emit),
    ("stats", putStrLn . St.emitJSON),
    ("ast", putStrLn . show),
    ("frags", putStrLn . Fr.emitJSON)]

main :: IO ()
main = do args <- getArgs
          if length args < 2
            then help
            else processArgs args

processArgs :: [String] -> IO ()
processArgs args =
    let category = head args
        args' = tail args
    in case category of
        "view" -> do input <- hGetContents stdin
                     case readView category input of
                        Left err -> die (show err)
                        Right ast -> processCmds args' input ast
        "action" -> do input <- hGetContents stdin
                       case readAction category input of
                            Left err -> die (show err)
                            Right ast -> processCmds args' input ast
        otherwise -> die $ "Unknown category: " ++ category ++
                "\n\tOnly \"view\" or \"action\" are allowed\n"

help :: IO ()
help = die $ "Usage: restyscript <view|action> <command>...\n" ++
    "<command> could be either \"frags\", \"ast\", \"rs\", " ++
    "\"rename <oldvar> <newvar>\", \"stats\"\n"

processCmds :: [String] -> String -> RSVal -> IO ()
processCmds [] _ _ = return ()
processCmds (a:as) input ast =
    if a == "rename"
        then case as of
            old : new : as' -> do putStrLn $ Re.emit ast input old new
                                  processCmds as' input ast
            _ -> die "The \"rename\" command requires two arguments."
        else case lookup a argHandles of
                    Just hdl -> hdl ast >> processCmds as input ast
                    Nothing -> die $ "Unknown command: " ++ a

die :: String -> IO ()
die msg = do hPutStrLn stderr msg
             exitWith $ ExitFailure 1

