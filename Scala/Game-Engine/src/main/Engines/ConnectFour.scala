package Engines

import Abstract.BoardGame

import java.awt.geom.Ellipse2D
import java.awt.{BorderLayout, Color, Component, Dimension, Font, Graphics, Graphics2D, GridLayout, Image, Insets, RenderingHints, Shape}
import javax.imageio.ImageIO
import javax.swing.border.Border
import javax.swing.{BorderFactory, ImageIcon, JFrame, JLabel, JPanel, JTextField, SwingConstants}

class CircularJLabel extends JLabel {
  private var circleColor: Color = Color.white

  def setCircleColor(color: Color): Unit = {
    circleColor = color
  }

  override def paintComponent(g: Graphics): Unit = {
    val g2 = g.asInstanceOf[Graphics2D]
    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
    val size = getSize()
    val d = Math.min(size.width, size.height)
    val x = (size.width - d) / 2
    val y = (size.height - d) / 2
    val shape: Shape = new Ellipse2D.Double(x, y, d, d)
    g2.setColor(circleColor)
    g2.fill(shape)
    super.paintComponent(g)
  }
}

class ConnectFour extends BoardGame {
  override var rows: Int = 6
  override var cols: Int = 7
  horizontalIndexes = HorizontalIndex(cols)
  verticalIndexes = VerticalIndex(rows)
  var firstPlayerTurn: Boolean = true
  val redChip:ImageIcon =  new ImageIcon(ImageIO.read(getClass().getClassLoader.getResource("resources/ChipRed.png")))
  val yellowChip:ImageIcon =  new ImageIcon(ImageIO.read(getClass().getClassLoader.getResource("resources/ChipYellow.png")))

  def decidePlay(turn: Boolean, cell: CircularJLabel): Unit = {
    val chipImage = if (turn) redChip else yellowChip
    val cellSize = cell.getSize()
    val chipImageResized = chipImage.getImage().getScaledInstance(
      cellSize.width-10, cellSize.height, Image.SCALE_SMOOTH)
    val chipIcon = new ImageIcon(chipImageResized)
    cell.setIcon(chipIcon)
  }

  def getCell(index: Int): CircularJLabel =
    board.getComponent(index).asInstanceOf[CircularJLabel]

  override def drawer(panel: JPanel, frame: JFrame): Unit = {
    board = new JPanel()
    board.setLayout(new GridLayout(rows, cols))
    board.setBackground(Color.BLUE)
    val labels = (1 to rows * cols).map(_ => {
      val jLabel = new CircularJLabel()
      val size = 50
      jLabel.setPreferredSize(new Dimension(size, size))
      jLabel.setCircleColor(Color.WHITE)
      jLabel.setBorder(BorderFactory.createEmptyBorder())
      jLabel
    })
    labels.foreach(board.add)
    frame.add(horizontalIndexes.jPanel, BorderLayout.NORTH)
    panel.add(horizontalIndexes.copy().jPanel, 0)
    frame.add(verticalIndexes.jPanel, BorderLayout.WEST)
    frame.add(verticalIndexes.copy().jPanel, BorderLayout.EAST)
    frame.add(board, BorderLayout.CENTER)
    frame.revalidate()
  }


  override def controller(textField: JTextField, frame: JFrame): Unit = {
    val input = textField.getText
    if (
      input.length() != 1
        || !horizontalIndexes.range.contains(input.charAt(0))
    ) {
      errorMessage("invalid input", frame)
      return
    }

    val colIndex = input.charAt(0) - 'A'
    val columnIndex = cols * rows - cols + colIndex
    val labelsInColumn = for (i <- 0 until rows) yield {
      val index = cols * (rows - 1 - i) + colIndex
      board.getComponent(index).asInstanceOf[JLabel]
    }
    val nonEmptyLabels = labelsInColumn.filter(_.getIcon != null)
    if (nonEmptyLabels.length == rows) {
      errorMessage("Column is full", frame)
      return
    }
    for (i <- 0 until rows) {
      val index = cols * (rows - 1 - i) + colIndex
      if (board.getComponent(index).asInstanceOf[JLabel].getIcon == null) {
        decidePlay(firstPlayerTurn, getCell(index))
        textField.setText("")
        firstPlayerTurn = !firstPlayerTurn
        return
      }
    }
    errorMessage("invalid input", frame)

  }
}



