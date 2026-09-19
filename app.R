library(shiny)
library(readxl)
library(dplyr)
library(DT)

arquivo <- "Sistema_Apolo_Genetica_IPGA_COMPLETO.xlsx"
ranking <- read_excel(arquivo, sheet="Ranking_Cruzamentos")
plantel <- read_excel(arquivo, sheet="Plantel_Atual") |> mutate(Ativo=TRUE)

ui <- fluidPage(
  titlePanel("Apolo Genética"),
  tabsetPanel(
    tabPanel("♂ Sugestões por Galador",
      selectInput("macho","Galador",sort(unique(ranking$Macho))),
      DTOutput("ranking_macho")),
    tabPanel("♀ Sugestões por Matriz",
      selectInput("femea","Matriz",sort(unique(ranking$Femea))),
      DTOutput("ranking_femea"))
  )
)

server <- function(input, output, session){
  base_ativa <- reactive({
    a <- plantel |> filter(Ativo) |> pull(Nome)
    ranking |> filter(Macho %in% a, Femea %in% a)
  })

  output$ranking_macho <- renderDT({
    base_ativa() |> filter(Macho == input$macho) |>
      arrange(`IPGA_Sobreposicao_Base_%`, `Similaridade_Base_%`) |> datatable()
  })

  output$ranking_femea <- renderDT({
    # Visão inversa: reutiliza exatamente a MESMA linha macho×fêmea.
    base_ativa() |> filter(Femea == input$femea) |>
      arrange(`IPGA_Sobreposicao_Base_%`, `Similaridade_Base_%`) |> datatable()
  })
}
shinyApp(ui, server)
