import React from "react";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import BaseModal from "../BaseModal";

function InfoModal() {
  return (
    <BaseModal
      title=""
      trigger={<Info className="mr-4" />}
      initiallyOpen={false}
      actionButtonText="Got It!"
    >
      <Tabs defaultValue="how-to-play">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="how-to-play">How To Play</TabsTrigger>
          <TabsTrigger value="about-us">About Us</TabsTrigger>
        </TabsList>
        <TabsContent value="how-to-play">
          {" "}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's The Goal?</AccordionTrigger>
              <AccordionContent>
                Find groups of items or names that share something in common. There is a predefined way to group the entire grid. By finding these groupings, you will have solved the puzzle!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How Do I Play?</AccordionTrigger>
              <AccordionContent>
                Select the items and tap 'Submit' to check if your guess matches
                one of the answer categories. If the grouping is correct, the items will merge into a banner and no longer be selectable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How Many Tries Do I Get?</AccordionTrigger>
              <AccordionContent>
                {`You can make mistakes up to the limit on the display before the game ends. Once you have no more green mistake counters, your next mistake will end the game.`}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Anonymous Data Collection</AccordionTrigger>
              <AccordionContent>
                  {`Your anonymous results including guesses and time taken will be collected to help guide future games. If you do not wish to have your data collected, you may choose not to play the game.`}
              </AccordionContent>
          </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="about-us">
          {" "}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Who Made This?</AccordionTrigger>
              <AccordionContent>
                This project is adapted from a project by andcomputers, edited and adapted by Ethan Fong.{" "}
                <a
                  href="https://andcomputers.io/"
                  target="_blank"
                  className="underline font-bold"
                >
                  Original link.
                </a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why Does This Game Exist?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-1">This game was created for a study to gauge how a connections inspired puzzle may affect student engagement with computer science concepts.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </BaseModal>
  );
}

export default InfoModal;
