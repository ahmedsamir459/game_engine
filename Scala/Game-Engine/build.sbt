ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.2.2"

lazy val root = (project in file("."))
  .settings(
    name := "Game-Engine"
  )



libraryDependencies ++= Seq(
  "org.scalafx" %% "scalafx" % "16.0.0-R25",
)

Compile/mainClass := Some("main")
assembly/mainClass := Some("main")

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}

