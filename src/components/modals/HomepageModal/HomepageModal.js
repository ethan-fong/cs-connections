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

function HomepageModal() {
  return (
    <BaseModal
      title=""
      trigger={<Info className="mr-4" />}
      initiallyOpen={false}
      actionButtonText="Got It!"
    >
      <Tabs defaultValue="create-a-game">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="create-a-game">Using This Tool as an Instructor</TabsTrigger>
        </TabsList>
        <TabsContent value="create-a-game">
          {" "}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Creating a Course</AccordionTrigger>
              <AccordionContent>
                Please use an institutional email and contact ethan.fong@mail.utoronto.ca to request the creation of a course on this app.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Uploading Games</AccordionTrigger>
              <AccordionContent>
                Once a course has been created, you will also be given credentials to upload games via a separate backend site.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Student Made Games</AccordionTrigger>
              <AccordionContent>
                Students can create games without authentication, but these games will be displayed under the student games section
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </BaseModal>
  );
}

export default HomepageModal;
