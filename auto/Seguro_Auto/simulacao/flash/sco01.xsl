<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent ="yes" encoding="utf-8"/>

<xsl:template match="/">
  <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd">
    <general>
      <catalogentry>
        <catalog>flash simulation</catalog>
        <entry>
          <langstring>N/A</langstring>
        </entry>
      </catalogentry>
      <title>
        <langstring>
          <xsl:value-of select="Simulation/Settings/FlashSettings/LessonName"/>
        </langstring>
      </title>
      <description>
        <langstring> </langstring>
      </description>
      <keyword>
        <langstring>N/A</langstring>
      </keyword>
    </general>
    <lifecycle>
      <version>
        <langstring>1.0</langstring>
      </version>
      <status>
        <source>
          <langstring xml:lang="x-none">LOMv1.0</langstring>
        </source>
        <value>
          <langstring xml:lang="x-none">Final</langstring>
        </value>
      </status>
    </lifecycle>
    <metametadata>
      <metadatascheme>ADL SCORM 1.2</metadatascheme>
      <language>en-US</language>
    </metametadata>
    <technical>
      <format>text/html</format>
      <location type="URI">.</location>
      <requirement>
        <type>
          <source>
            <langstring xml:lang="x-none">LOMv1.0</langstring>
          </source>
          <value>
            <langstring xml:lang="x-none">Browser</langstring>
          </value>
        </type>
        <name>
          <source>
            <langstring xml:lang="x-none">LOMv1.0</langstring>
          </source>
          <value>
            <langstring xml:lang="x-none">Microsoft Internet Explorer</langstring>
          </value>
        </name>
        <minimumversion>4.01</minimumversion>
      </requirement>
    </technical>
    <rights>
      <cost>
        <source>
          <langstring xml:lang="x-none">LOMv1.0</langstring>
        </source>
        <value>
          <langstring xml:lang="x-none">no</langstring>
        </value>
      </cost>
      <copyrightandotherrestrictions>
        <source>
          <langstring xml:lang="x-none">LOMv1.0</langstring>
        </source>
        <value>
          <langstring xml:lang="x-none">yes</langstring>
        </value>
      </copyrightandotherrestrictions>
    </rights>
    <classification>
      <purpose>
        <source>
          <langstring xml:lang="x-none">LOMv1.0</langstring>
        </source>
        <value>
          <langstring xml:lang="x-none">Educational Objective</langstring>
        </value>
      </purpose>
      <description>
        <langstring>N/A</langstring>
      </description>
      <keyword>
        <langstring>Simulation</langstring>
      </keyword>
    </classification>
  </lom>
</xsl:template>

</xsl:stylesheet> 
