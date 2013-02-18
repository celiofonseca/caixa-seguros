<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" 
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="">
  <xsl:output method="xml" indent ="yes" encoding="utf-8"/>

  <xsl:variable name="setting" select="Simulation/Settings/FlashSettings"/>
  <xsl:variable name="lessonName" select="$setting/LessonName"/>

  <xsl:template match="/">
    <manifest>
      <xsl:attribute name="identifier">
        <xsl:value-of select="$setting/Scorm/Guid"/>
      </xsl:attribute>
      <xsl:attribute name="version">1.1</xsl:attribute>
      <xsl:attribute name="xsi:schemaLocation">http://www.imsproject.org/xsd/imscp_rootv1p1p2  imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd</xsl:attribute>
      
      <metadata />
      <organizations>
        <xsl:attribute name="default">
          <xsl:value-of select="$lessonName"/>
        </xsl:attribute>
        <organization>
          <xsl:attribute name="identifier">
            <xsl:value-of select="$lessonName"/>
          </xsl:attribute>
          <title>Simulator</title>
          <item identifier="SCO" identifierref="SCO1" isvisible="true">
            <title>
              <xsl:value-of select="$lessonName"/>
            </title>
            <adlcp:masteryscore>
              <xsl:value-of select="$setting/Playback/PassingGrade"/>
            </adlcp:masteryscore>
          </item>
        </organization>
      </organizations>
      <resources>
        <resource identifier="SCO1" type="webcontent" adlcp:scormtype="sco" href="index.htm">
          <metadata>
            <schema>ADL SCORM</schema>
            <schemaversion>1.2</schemaversion>
            <adlcp:location>sco01.xml</adlcp:location>
          </metadata>
          <!--
          <xsl:for-each select="Simulation/Resources">
            <file>
              <xsl:attribute name="href">
                <xsl:value-of select="PlayBackFile"/>
              </xsl:attribute>
            </file>
            <xsl:for-each select="TemplateFiles">
              <xsl:call-template name="FilesTemplate"></xsl:call-template>
            </xsl:for-each>
            
            <xsl:for-each select="LessonFiles">
              <xsl:call-template name="FilesTemplate"></xsl:call-template>
            </xsl:for-each>
          </xsl:for-each>
          -->
        </resource>
      </resources>

    </manifest>
  </xsl:template>
  <!--
  <xsl:template name="FilesTemplate">
    <xsl:for-each select="File">
      <xsl:choose>
        <xsl:when test="not (@Target)">
          <file>
            <xsl:attribute name="href">
              <xsl:value-of select="."/>
            </xsl:attribute>
          </file>
        </xsl:when>
        <xsl:otherwise>
          <xsl:if test="@Target != 'swf'">
            <file>
              <xsl:attribute name="href">
                <xsl:choose>
                  <xsl:when test="string-length(@Target) != 0">
                    <xsl:value-of select="@Target"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="."/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
            </file>
          </xsl:if>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>
  -->
</xsl:stylesheet>
